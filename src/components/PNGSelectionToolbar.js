import React from 'react';
import { useDrag } from 'react-dnd';

const DraggablePNGThumbnail = ({ image, onSelectImage }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'image/png',
    item: { id: image.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <img
      ref={dragRef}
      key={image.id}
      src={image.url}
      alt="Static PNG"
      onClick={() => onSelectImage(image)}
      className="thumbnail"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    />
  );
};

const PNGSelectionSidebar = ({ images = [], onSelectImage }) => {
  return (
    <div className="png-selection-sidebar">
        {images.map((image) => (
        <DraggablePNGThumbnail key={image.id} image={image} onSelectImage={onSelectImage} />
        ))}
    </div>
  );
};

export default PNGSelectionSidebar;
