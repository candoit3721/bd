"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SKYZONE_IMAGES } from '../constants/images';

interface PhotoGalleryProps {}

const PhotoGallery: React.FC<PhotoGalleryProps> = () => {
  const [randomImages] = useState(() => {
    const shuffled = [...SKYZONE_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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
            <Image
              src={imageUrl}
              alt={`SkyZone activity ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority={index < 2}
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
            
            <div className="relative aspect-video">
              <Image
                src={selectedImage}
                alt="SkyZone activity"
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
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
