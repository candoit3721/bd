"use client";

import React, { useState } from 'react';
import { useImageCache } from '../hooks/useImageCache';
import { useRandomImages } from '../hooks/useRandomImages';
import { useImagePreloader } from '../contexts/ImagePreloaderContext';
import { SKYZONE_IMAGES } from '../constants/images';

const PhotoGallery: React.FC = () => {
  const randomImages = useRandomImages(SKYZONE_IMAGES, 6) || [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { isImageLoaded } = useImagePreloader();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  };

  const handleImageClick = (imageUrl: string) => {
    const index = SKYZONE_IMAGES.indexOf(imageUrl);
    setSelectedIndex(index);
    setSelectedImage(imageUrl);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (selectedIndex - 1 + SKYZONE_IMAGES.length) % SKYZONE_IMAGES.length;
    setSelectedIndex(newIndex);
    setSelectedImage(SKYZONE_IMAGES[newIndex]);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (selectedIndex + 1) % SKYZONE_IMAGES.length;
    setSelectedIndex(newIndex);
    setSelectedImage(SKYZONE_IMAGES[newIndex]);
  };

  return (
    <div className="photo-gallery-section p-4">
      <h3 className="flex items-center gap-2 mb-4">
        <i className="fas fa-images"></i> Photo Gallery
      </h3>
      <p className="mb-6">Check out the fun we'll have at SkyZone!</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {randomImages.map((imageUrl, index) => (
          <div 
            key={imageUrl}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-gray-200"
            onClick={() => handleImageClick(imageUrl)}
          >
            {!loadedImages.has(imageUrl) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-party-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={imageUrl}
              alt={`SkyZone activity ${index + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                loadedImages.has(imageUrl) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(imageUrl)}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={handlePrevImage}
            className="absolute left-4 text-white hover:text-gray-300 text-4xl"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            
            <img
              src={selectedImage}
              alt="SkyZone activity"
              className="w-full h-auto object-contain"
            />
          </div>

          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white hover:text-gray-300 text-4xl"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
