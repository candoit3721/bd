"use client";

import React from 'react';

const PhotoGallery: React.FC = () => {
  return (
    <div className="photo-gallery-section">
      <h3>
        <i className="fas fa-images"></i> Photo Gallery
      </h3>
      <p>Check out the fun we'll have at SkyZone!</p>

      <div className="photo-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="photo-item">
            <div className="photo-placeholder">
              <i className="fas fa-image"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
