"use client";

import React, { useState, useEffect } from 'react';
import { useImageCache } from '../hooks/useImageCache';
import { useRandomImages } from '../hooks/useRandomImages';
import { useImagePreloader } from '../contexts/ImagePreloaderContext';

const SKYZONE_IMAGES = [
  'https://www.skyzone.com/wp-content/uploads/2022/09/about_hero.jpg',
  'https://www.skyzone.com/wp-content/uploads/2024/04/Sky-Zone-Ways-To-Play.webp',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/a5/cb/6b/ninja-warrior-course.jpg?w=900&h=500&s=1',
  'https://www.utahsadventurefamily.com/wp-content/uploads/2024/10/Sky-Zone-1-scaled.jpg',
  'https://www.utahsadventurefamily.com/wp-content/uploads/2024/10/Sky-Zone-4-600x400.jpg',
  'https://evanstonroundtable.com/wp-content/uploads/2024/01/IMG_7721-1-scaled-e1705789552245.jpg',
  // Add more SkyZone images here...
  'https://www.skyzone.com/wp-content/uploads/2023/05/SZ_tickets_card_1-e1684266882819.jpg',
  'https://www.skyzone.com/wp-content/uploads/2023/05/DSC07291-e1682542947247.jpg',
  'https://www.skyzone.com/wp-content/uploads/2022/10/battle_beam-e1666684372567.jpeg',
  'https://www.skyzone.com/wp-content/uploads/2022/11/attraction-stuntbag-card.jpg',
  'https://www.skyzone.com/wp-content/uploads/2023/05/KWP_9283-Edit_lr-e1680884438990.jpg',
  'https://www.skyzone.com/wp-content/uploads/2023/05/BMS02483-scaled-e1681334000772.jpg',
  'https://www.skyzone.com/wp-content/uploads/2023/05/SkyZone-101921-5683-copy.png',
  'https://www.skyzone.com/wp-content/uploads/2023/05/Skyzone-Square-format-31-of-56-scaled-e1681764882592.jpg',
  'https://www.skyzone.com/wp-content/uploads/2022/10/fundraising_hero.jpg',
  'https://www.skyzone.com/wp-content/uploads/2023/05/Plan-an-Amazing-Event-with-Us-2.png',
  'https://www.skyzone.com/wp-content/uploads/2023/05/Skyzone-Square-format-25-of-56-scaled.jpg',
  'https://www.skyzone.com/wp-content/uploads/2023/05/park_slider_02-2.png',
  'https://www.skyzone.com/wp-content/uploads/2023/05/iWall-Games-1.png'  
];

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
