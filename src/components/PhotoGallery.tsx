"use client";

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { SKYZONE_IMAGES } from '../constants/images';
import { useUI } from '../contexts/UIContext';

interface PhotoGalleryProps {}

const PhotoGallery: React.FC<PhotoGalleryProps> = () => {
  const [randomImages] = useState(() => {
    const shuffled = [...SKYZONE_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalPosition, setModalPosition] = useState(0);
  const { setIsModalOpen } = useUI();

  const handleImageClick = (imageUrl: string, event: React.MouseEvent<HTMLDivElement>) => {
    const index = SKYZONE_IMAGES.indexOf(imageUrl);
    setSelectedIndex(index);
    setSelectedImage(imageUrl);
    setIsModalOpen(true);

    // Calculate modal position based on clicked image
    const clickedElement = event.currentTarget;
    const rect = clickedElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const modalHeight = viewportHeight * 0.8; // 80vh - matching maxHeight
    
    // Calculate the ideal position that would center the modal around the clicked point
    let topPosition = rect.top + window.pageYOffset - (modalHeight - rect.height) / 2;
    
    // Make sure the modal doesn't go above the viewport
    topPosition = Math.max(window.pageYOffset, topPosition);
    
    // Make sure the modal doesn't go below the viewport
    const maxTopPosition = window.pageYOffset + viewportHeight - modalHeight;
    topPosition = Math.min(maxTopPosition, topPosition);

    // Scroll to the modal position
    window.scrollTo({
      top: topPosition,
      behavior: 'smooth'
    });

    // Set the modal position
    setModalPosition(topPosition);
  };

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    setIsModalOpen(false);
  }, [setIsModalOpen]);

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
            onClick={(e) => handleImageClick(imageUrl, e)}
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
          className="fixed left-0 right-0 z-50 bg-black md:inset-0 md:flex md:items-center md:justify-center"
          onClick={handleClose}
          style={{
            top: `${modalPosition}px`,
            height: '80vh',
            maxHeight: '80vh',
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-50 p-2
                       bg-black bg-opacity-50 rounded-full"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* Previous button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 text-white hover:text-gray-300 z-50 p-2
                       bg-black bg-opacity-50 rounded-full"
            >
              <i className="fas fa-chevron-left text-xl"></i>
            </button>

            {/* Image container with maintained aspect ratio */}
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={selectedImage}
                alt="SkyZone activity"
                fill
                className="object-contain"
                sizes="100vw"
                priority
                quality={100}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Next button */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 text-white hover:text-gray-300 z-50 p-2
                       bg-black bg-opacity-50 rounded-full"
            >
              <i className="fas fa-chevron-right text-xl"></i>
            </button>

            {/* Image counter */}
            <div 
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white 
                       bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm"
            >
              {selectedIndex + 1} / {SKYZONE_IMAGES.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
