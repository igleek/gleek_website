import React, { useRef, useEffect, useState } from 'react';

const EditableCanvas = ({ backgroundImage, pngImages }) => {
  const canvasRef = useRef(null);

  // Example state for a single PNG, extend this concept for multiple PNGs
  const [pngState, setPngState] = useState({
    x: 100, // Initial X position
    y: 100, // Initial Y position
    width: 100, // Width of the PNG
    height: 100, // Height of the PNG
    rotation: 0, // Rotation angle in degrees
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    if (backgroundImage) {
      // Assume backgroundImage is a data URL or a path to the image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = backgroundImage;
    }

    // Draw PNG images
    pngImages.forEach((png) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(pngState.x + pngState.width / 2, pngState.y + pngState.height / 2);
        ctx.rotate((pngState.rotation * Math.PI) / 180);
        ctx.drawImage(img, -pngState.width / 2, -pngState.height / 2, pngState.width, pngState.height);
        ctx.restore();
      };
      img.src = png.url;
    });
  }, [backgroundImage, pngImages, pngState]);

  return <canvas ref={canvasRef} width={640} height={480} />;
};

export default EditableCanvas;
