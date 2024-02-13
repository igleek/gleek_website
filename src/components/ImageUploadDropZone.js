import React from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploadDropzone = (props) => {
  const { onDrop } = props;
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false // Set to true if you want to accept multiple files
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag 'n' drop your image here, or click to select one</p>
    </div>
  );
};

export default ImageUploadDropzone;
