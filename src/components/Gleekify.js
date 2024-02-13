import React, { useState } from 'react';
import { useDrop } from 'react-dnd'; // 
import ImageUploadDropzone from './ImageUploadDropZone';
import PNGSelectionSidebar from './PNGSelectionToolbar';
import EditableCanvas from './EditableCanvas';


const Gleekify = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  // Add a state for managing selected PNG
  const [selectedPNG, setSelectedPNG] = useState(null);
  const [collectedProps, drop] = useDrop(() => ({
    accept: 'image/png',
    drop: (item, monitor) => handleDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const [pngImages, setPngImages] = useState([
    { id: 1, url: './images/Gleekify/fire.png', width: 0, height:250 },
    { id: 2, url: './images/Gleekify/acid.png', width: 250, height:250  },
  ]);

  const handleDrop = (pngId) => {
    // Logic to handle the dropped PNG, such as adding it to the canvas
  };

  const handleImageUploadDropzone = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handler for selecting a PNG from the sidebar
  const handleSelectPNG = (png) => {
    setSelectedPNG(png);
    // Further logic to add this PNG to the canvas or displayed image
  };

  return (
    <div ref={drop} className="gleekify-container">
      <ImageUploadDropzone onDrop={handleImageUploadDropzone} />
      {uploadedImage && (
        <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />
      )}

      <PNGSelectionSidebar images={pngImages} onSelectImage={handleSelectPNG} />
      <EditableCanvas backgroundImage={uploadedImage} pngImages={pngImages} />
    </div>
  );
};

export default Gleekify;
