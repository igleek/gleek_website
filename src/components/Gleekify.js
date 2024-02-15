import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useDrag, useDrop } from 'react-dnd';

const IMAGE_WIDTH = '100px'; // Set the width
const IMAGE_HEIGHT = '100px';
const IMAGE_TARGET_WIDTH = 100; // Target width for images on canvas
const IMAGE_TARGET_HEIGHT = 100;

// Custom hook for loading images
const useImage = (src) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.onerror = err => console.error('Failed to load image:', err);
      img.src = src;
      return () => {
          img.onload = null;
          img.onerror = null;
      };
  }, [src]);
  return image;
};


const Gleekify = () => {
  const [backgroundSrc, setBackgroundSrc] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const backgroundImage = useImage(backgroundSrc);
  const [elements, setElements] = useState([]);
  const stageRef = useRef(null);

  // Draggable Image Item for Side Menu
  const DraggableImageMenuItem = ({ image }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'image',
      item: { url: image.url },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        {/* Apply the width and height in the style attribute */}
        <img src={image.url} alt="" style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT, cursor: 'pointer' }} />
      </div>
    );
  };

  const DraggableImage = ({ src, x, y, onDragEnd, id, onSelect }) => {
    const image = useImage(src);
    
    // Force the image to be 100x100 pixels by setting width and height directly
    const forcedWidth = 100;
    const forcedHeight = 100;
  
    return image ? (
      <KonvaImage
        image={image}
        x={x}
        y={y}
        width={forcedWidth}  // Set width to 100 pixels
        height={forcedHeight} // Set height to 100 pixels
        draggable
        onClick={(e) => onSelect(e, id)}
        onDragEnd={onDragEnd}
      />
    ) : null;
  };

const toggleFlipHorizontal = (id) => {
  const updatedElements = elements.map((el) => {
    if (el.id === id) {
      return { ...el, scaleX: el.scaleX === 1 ? -1 : 1 };
    }
    return el;
  });
  setElements(updatedElements);
};

const handleSelect = (e, id) => {
  setSelectedId(id);
  e.evt.stopPropagation(); // Correct way to stop event bubbling in Konva
};

  // Example static images
  const staticImages = [
    { url: './images/Gleekify/acid.png' },
    { url: './images/Gleekify/fire.png' },
    { url: './images/Gleekify/gleek_1.png' },
    { url: './images/Gleekify/gleek_2.png' },
    { url: './images/Gleekify/gleek_3.png' },
    { url: './images/Gleekify/rainbow.png' },
    { url: './images/Gleekify/tongue_1.png' },
    { url: './images/Gleekify/tongue_2.png' },
    { url: './images/Gleekify/tongue_and_acid.png' },
    { url: './images/Gleekify/tongue_and_fire.png' },
    { url: './images/Gleekify/tongue_and_gleek.png' },
    { url: './images/Gleekify/tongue_and_rainbow.png' },
    // Add more images as needed
  ];

  const [, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const stageBox = stageRef.current.container().getBoundingClientRect();
      const x = clientOffset.x - stageBox.left;
      const y = clientOffset.y - stageBox.top;
      addElementToCanvas(item.url, x, y);
    },
  }));

  const addElementToCanvas = (url, x, y) => {
    const newItem = {
      src: url,
      x: x,
      y: y,
      width: 100, // Set width to 100 pixels as previously defined
      height: 100, // Set height to 100 pixels as previously defined
      id: Math.random().toString(36).substr(2, 9), // Unique ID for each element
    };
  
    // Correctly append the new item to the existing elements
    setElements(prevElements => [...prevElements, newItem]);
  };

  const handleDragEnd = (e, index) => {
    const updatedElements = elements.map((el, idx) => {
      if (idx === index) {
        return { ...el, x: e.target.x(), y: e.target.y() };
      }
      return el;
    });
    setElements(updatedElements);
  };


  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const TransformerComponent = ({ selectedId }) => {
    const transformerRef = useRef();
    const stageRef = useRef();
    
    useEffect(() => {
      const stage = stageRef.current.getStage();
      if (selectedId) {
        const selectedNode = stageRef.current.findOne((node) => node.id() === selectedId);
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [selectedId]);
  
    return <Transformer ref={transformerRef} />;
  };

  const flipImageHorizontal = (id) => {
    const updatedElements = elements.map(el => {
      if (el.id === id) {
        return { ...el, flipHorizontal: !el.flipHorizontal };
      }
      return el;
    });
    setElements(updatedElements);
  };
  return (
    <div className="gleekify-container" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="side-menu" style={{ width: '200px', height: '100vh', overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>
        {staticImages.map((image, index) => (
          <DraggableImageMenuItem key={index} image={image} />
        ))}
      </div>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input type="file" onChange={handleUpload} accept="image/*" style={{ marginTop: '20px' }} />
        <div ref={drop} className="canvas-frame" style={{ border: '3px solid #333', margin: '20px', width: '80%', height: '600px' }}>
          <Stage width={window.innerWidth * 0.8} height={600} ref={stageRef}>
          <Layer>
  {backgroundImage && <KonvaImage image={backgroundImage} />}
  {elements.map((element, i) => (
    <DraggableImage
      key={i}
      src={element.src}
      x={element.x}
      y={element.y}
      onDragEnd={(e) => handleDragEnd(e, i)}
      isSelected={element.id === selectedId}
      onSelect={(e) => handleSelect(e, element.id)}
    />
  ))}
  {selectedId && <TransformerComponent selectedId={selectedId} />}
</Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};


export default Gleekify;