import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import AnnotationCanvas from './components/AnnotationCanvas';
import Toolbar from './components/Toolbar';
import ExportButton from './components/ExportButton';
import './App.css';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Annotator</h1>
        <div className="header-controls">
          <ImageUpload onImageUpload={setCurrentImage} />
          <ExportButton 
            annotations={annotations} 
            imageId={currentImage?.id} 
          />
        </div>
      </header>
      
      <div className="app-body">
        <Toolbar 
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
        />
        
        <AnnotationCanvas
          image={currentImage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          selectedTool={selectedTool}
          currentAnnotation={currentAnnotation}
          setCurrentAnnotation={setCurrentAnnotation}
        />
      </div>
    </div>
  );
}

export default App;