import React from 'react';

const ExportButton = ({ annotations, imageId, imageNaturalWidth, imageNaturalHeight }) => {
  
  // Function to convert internal annotation object to VIA format shape_attributes
  const toViaShape = (annotation) => {
    const shape = { name: annotation.type };
    
    // Note: VIA uses coordinates relative to the original image size. 
    // Since we are currently storing coordinates relative to the initial scaled canvas size, 
    // we assume these scaled coordinates are sufficient for *this* app's export 
    // (a full normalization is a larger refactor).
    
    if (annotation.type === 'point') {
      shape.cx = Math.round(annotation.x);
      shape.cy = Math.round(annotation.y);
    } else if (annotation.type === 'rectangle' || annotation.type === 'ellipse') {
      // Calculate normalized top-left corner and size
      const x = Math.min(annotation.x, annotation.x + annotation.width);
      const y = Math.min(annotation.y, annotation.y + annotation.height);
      const w = Math.abs(annotation.width);
      const h = Math.abs(annotation.height);

      if (annotation.type === 'rectangle') {
        shape.x = Math.round(x);
        shape.y = Math.round(y);
        shape.width = Math.round(w);
        shape.height = Math.round(h);
      } else if (annotation.type === 'ellipse') {
        shape.cx = Math.round(x + w / 2);
        shape.cy = Math.round(y + h / 2);
        shape.rx = Math.round(w / 2);
        shape.ry = Math.round(h / 2);
      }
    } else if (annotation.type === 'pen') {
      // VIA equivalent for freehand path is 'polygon' (which just stores points)
      shape.name = 'polygon';
      shape.all_points_x = annotation.points.map(p => Math.round(p.x));
      shape.all_points_y = annotation.points.map(p => Math.round(p.y));
    }
    
    return shape;
  };
  
  // Function to generate the entire VIA JSON structure
  const buildViaJson = () => {
    const viaData = {};
    const fileId = `${imageId || 'export'}.png`; // Use placeholder filename

    viaData[fileId] = {
      filename: fileId,
      size: 0, // Placeholder, as file size is not tracked
      regions: annotations.map(ann => ({
        shape_attributes: toViaShape(ann),
        // Placeholder for region attributes (where pin_names, etc., would go)
        region_attributes: ann.attributes || {} 
      })),
      file_attributes: {
        // Optional: Include image dimensions for reference
        natural_width: imageNaturalWidth,
        natural_height: imageNaturalHeight
      }
    };
    return viaData;
  };


  const handleExport = () => {
    if (!annotations || annotations.length === 0) {
      alert('No annotations to export!');
      return;
    }

    const exportData = buildViaJson();
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `via_annotations-${imageId || 'export'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      className="export-btn" 
      onClick={handleExport}
      disabled={!annotations || annotations.length === 0}
    >
      Export VIA JSON
    </button>
  );
};

export default ExportButton;