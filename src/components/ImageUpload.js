import React from 'react';

const ImageUpload = ({ onImageUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = function() {
        const imageInfo = {
          id: Date.now().toString(),
          url: imageUrl,
          name: file.name,
          filename: file.name,
          naturalWidth: this.naturalWidth,
          naturalHeight: this.naturalHeight
        };
        onImageUpload(imageInfo);
      };
      
      img.src = imageUrl;
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input" className="upload-btn">
        Upload Image
      </label>
    </div>
  );
};

export default ImageUpload;