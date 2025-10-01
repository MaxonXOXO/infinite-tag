import React, { useRef, useEffect, useState } from 'react';

const AnnotationCanvas = ({ 
  image, 
  annotations, 
  setAnnotations, 
  selectedTool,
  currentAnnotation,
  setCurrentAnnotation 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [loadedImage, setLoadedImage] = useState(null);

  // 1. Initialize canvas size when image loads
  useEffect(() => {
    if (image && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const maxWidth = rect.width - 40;
      const maxHeight = rect.height - 40;
      
      let width = image.naturalWidth;
      let height = image.naturalHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      setCanvasSize({ width, height });
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [image]);
  
  // 2. Load the image object when 'image' prop changes
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setLoadedImage(img);
      };
      img.onerror = () => {
        console.error("Failed to load image:", image.url);
        setLoadedImage(null);
      };
      img.src = image.url;
    } else {
      setLoadedImage(null);
    }
  }, [image]);


  // Get accurate mouse position accounting for scale and offset
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    
    // Convert to image coordinates
    const x = (rawX - offset.x) / scale;
    const y = (rawY - offset.y) / scale;
    
    return { x, y };
  };

  // Zoom with mouse wheel
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * zoomIntensity);
    
    setScale(prevScale => {
      const newScale = prevScale * zoom;
      return Math.min(Math.max(0.1, newScale), 5);
    });
  };

  // Handle mouse down for drawing and panning
  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    
    // Middle mouse button for panning
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Left mouse button for drawing/starting
    if (e.button === 0) {
      if (selectedTool === 'select') return;
      
      setIsDrawing(true);
      setStartPos(pos);
      
      const nextId = (annotations.length + 1).toString();
      
      const newAnnotation = {
        id: nextId,
        type: selectedTool,
        imageId: image.id,
        points: (selectedTool === 'pen') ? [pos] : [], 
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color: '#ff0000',
        fill: 'rgba(255, 0, 0, 0.1)'
      };
      
      if (selectedTool !== 'point') {
        setCurrentAnnotation(newAnnotation);
      } else {
        setCurrentAnnotation({ ...newAnnotation });
      }
    }
  };

  const handleMouseMove = (e) => {
    // Handle panning
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (!isDrawing || !currentAnnotation) return;
    
    const pos = getMousePos(e);
    
    if (selectedTool === 'rectangle' || selectedTool === 'ellipse') { 
      // --- CENTER-PIVOT DRAWING LOGIC ---
      const dx = pos.x - startPos.x;
      const dy = pos.y - startPos.y;

      const updatedAnnotation = {
        ...currentAnnotation,
        // Top-left corner (x, y) is calculated by subtracting the distance (dx, dy)
        x: startPos.x - dx,
        y: startPos.y - dy,
        // Width and height are twice the distance from the center
        width: dx * 2,
        height: dy * 2
      };
      // --- END CENTER-PIVOT DRAWING LOGIC ---
      setCurrentAnnotation(updatedAnnotation);
    } else if (selectedTool === 'point') {
      const updatedAnnotation = {
        ...currentAnnotation,
        x: pos.x,
        y: pos.y
      };
      setCurrentAnnotation(updatedAnnotation);
    } else if (selectedTool === 'pen') { 
      const updatedPoints = [...currentAnnotation.points, pos];
      const updatedAnnotation = {
        ...currentAnnotation,
        points: updatedPoints
      };
      setCurrentAnnotation(updatedAnnotation);
    }
  };

  const handleMouseUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    if (!isDrawing || !currentAnnotation) return;
    
    const pos = getMousePos(e);
    const minSize = 5;
    
    if (selectedTool === 'point') {
      const finalAnnotation = {
        ...currentAnnotation,
        x: pos.x,
        y: pos.y
      };
      setAnnotations(prev => [...prev, finalAnnotation]);
    } else if (selectedTool === 'rectangle' || selectedTool === 'ellipse') { 
      // --- CENTER-PIVOT FINALIZE LOGIC ---
      const dx = pos.x - startPos.x;
      const dy = pos.y - startPos.y;
      const finalWidth = dx * 2;
      const finalHeight = dy * 2;
      
      if (Math.abs(finalWidth) > minSize && Math.abs(finalHeight) > minSize) {
        const finalAnnotation = {
          ...currentAnnotation,
          // Store the calculated top-left corner
          x: startPos.x - dx,
          y: startPos.y - dy,
          width: finalWidth,
          height: finalHeight
        };
        setAnnotations(prev => [...prev, finalAnnotation]);
      }
      // --- END CENTER-PIVOT FINALIZE LOGIC ---
    } else if (selectedTool === 'pen') { 
      if (currentAnnotation.points.length > minSize) {
        setAnnotations(prev => [...prev, currentAnnotation]);
      }
    }
    
    setCurrentAnnotation(null);
    setIsDrawing(false);
  };

  // Keyboard events for spacebar panning (unchanged)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isPanning) {
        e.preventDefault();
        setIsPanning(true);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grabbing';
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsPanning(false);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = selectedTool === 'select' ? 'default' : 'crosshair';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning, selectedTool]);

  // Update cursor based on tool and panning state (unchanged)
  useEffect(() => {
    if (canvasRef.current) {
      if (isPanning) {
        canvasRef.current.style.cursor = 'grabbing';
      } else {
        canvasRef.current.style.cursor = selectedTool === 'select' ? 'default' : 'crosshair';
      }
    }
  }, [isPanning, selectedTool]);

  // Draw everything (unchanged from your fixed version)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    
    ctx.drawImage(loadedImage, 0, 0, canvasSize.width, canvasSize.height);
    
    drawAnnotations(ctx);

    ctx.restore();
    
  }, [loadedImage, annotations, currentAnnotation, scale, offset, canvasSize]);


  const drawAnnotations = (ctx) => {
    annotations.forEach(annotation => {
      drawSingleAnnotation(ctx, annotation);
    });
    
    if (currentAnnotation) {
      drawSingleAnnotation(ctx, currentAnnotation);
    }
  };

  const drawSingleAnnotation = (ctx, annotation) => {
    ctx.strokeStyle = annotation.color || '#ff0000';
    ctx.lineWidth = 2 / scale;
    ctx.fillStyle = annotation.fill || 'rgba(255, 0, 0, 0.1)';
    
    // Normalize coordinates for drawing functions
    // Note: Since we are storing the top-left corner, x/y already represents the smallest x/y, 
    // but the bounding box logic is safe.
    const x = Math.min(annotation.x, annotation.x + annotation.width);
    const y = Math.min(annotation.y, annotation.y + annotation.height);
    const w = Math.abs(annotation.width);
    const h = Math.abs(annotation.height);

    switch (annotation.type) {
      case 'rectangle':
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
        break;
      
      case 'ellipse':
        const cx = x + w / 2;
        const cy = y + h / 2;
        const rx = w / 2;
        const ry = h / 2;

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        break;
      
      case 'point':
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, 5 / scale, 0, 2 * Math.PI); 
        ctx.fill();
        ctx.stroke();
        break;
      
      case 'pen': 
        if (annotation.points && annotation.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
          
          for (let i = 1; i < annotation.points.length; i++) {
            ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
          }
          
          ctx.stroke();
          ctx.fill();
        }
        break;
      default:
        break;
    }
    
    // Draw annotation ID
    if (annotation.id) {
      ctx.fillStyle = '#000';
      ctx.font = `${12 / scale}px Arial`;
      
      let textX = annotation.x;
      let textY = annotation.y - (10 / scale);
      
      if (annotation.type === 'rectangle' || annotation.type === 'ellipse') {
         textX = x;
         textY = y - (10 / scale);
      }
      
      ctx.fillText(annotation.id, textX, textY);
    }
  };

  // Reset zoom and pan
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  if (!image) {
    return (
      <div className="annotation-canvas">
        <div className="no-image">Please upload an image to start annotating</div>
      </div>
    );
  }

  return (
    <div 
      className="annotation-canvas" 
      ref={containerRef}
      onWheel={handleWheel}
    >
      <div className="canvas-controls">
        <button onClick={resetView} className="control-btn">
          Reset View
        </button>
        <span className="zoom-info">Zoom: {Math.round(scale * 100)}%</span>
        <span className="tool-info">Tool: {selectedTool}</span>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
      />
      <div className="canvas-hints">
        <p>• Scroll to zoom • Middle mouse button to pan</p>
        <p>• Rectangle/Ellipse: Click and drag from center • Pen: Click, drag, release to complete</p>
      </div>
    </div>
  );
};

export default AnnotationCanvas;