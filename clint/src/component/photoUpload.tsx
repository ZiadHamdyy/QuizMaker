import React, { useState } from 'react';
import { useUploadthing } from '@uploadthing/react';

const PhotoUpload = () => {
  const [image, setImage] = useState(null);
  const { upload } = useUploadthing();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      try {
        const response = await upload(image);
        console.log('Upload successful:', response);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
};

export default PhotoUpload;
