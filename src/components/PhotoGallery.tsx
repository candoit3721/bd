"use client";

import React, { useState, useCallback, useRef, TouchEvent } from 'react';
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
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState({ x: 0, y: 0 });
  const { setIsModalOpen } = useUI();

  // Touch handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const minSwipeDistance = 50;
  const minVerticalSwipeDistance = 100;

  const handleTouchStart = (e: TouchEvent) => {
    // Prevent default touch behavior to stop scrolling
    e.preventDefault();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
    setIsDragging(true);
    setDragDistance({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: TouchEvent) => {
    // Prevent default touch behavior to stop scrolling
    e.preventDefault();
    if (!touchStartX.current || !touchStartY.current) return;
    
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    
    // If the horizontal swipe is more prominent, prevent vertical movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragDistance({ x: deltaX, y: 0 });
    } else {
      setDragDistance({ x: 0, y: deltaY });
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    setIsDragging(false);
    
    if (!touchStartX.current || !touchEndX.current || 
        !touchStartY.current || !touchEndY.current) return;

    const swipeDistanceX = touchEndX.current - touchStartX.current;
    const swipeDistanceY = touchEndY.current - touchStartY.current;
    
    // Check if vertical swipe is more prominent
    if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
      if (swipeDistanceY > minVerticalSwipeDistance) {
        handleClose();
        return;
      }
    } else if (Math.abs(swipeDistanceX) >= minSwipeDistance) {
      if (swipeDistanceX > 0) {
        // Swiped right
        setSlideDirection('right');
        handlePrevImage(e as any);
      } else {
        // Swiped left
        setSlideDirection('left');
        handleNextImage(e as any);
      }
    }

    setDragDistance({ x: 0, y: 0 });
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleImageTransitionEnd = () => {
    setSlideDirection(null);
  };

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

  const handlePrevImage = (e: React.MouseEvent | TouchEvent) => {
    e.stopPropagation();
    setSlideDirection('right');
    const newIndex = (selectedIndex - 1 + SKYZONE_IMAGES.length) % SKYZONE_IMAGES.length;
    setSelectedIndex(newIndex);
    setSelectedImage(SKYZONE_IMAGES[newIndex]);
  };

  const handleNextImage = (e: React.MouseEvent | TouchEvent) => {
    e.stopPropagation();
    setSlideDirection('left');
    const newIndex = (selectedIndex + 1) % SKYZONE_IMAGES.length;
    setSelectedIndex(newIndex);
    setSelectedImage(SKYZONE_IMAGES[newIndex]);
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImage) {
      if (e.key === 'ArrowLeft') {
        handlePrevImage(e as any);
      } else if (e.key === 'ArrowRight') {
        handleNextImage(e as any);
      } else if (e.key === 'Escape') {
        handleClose();
      }
    }
  }, [selectedImage, selectedIndex]);

  // Add keyboard event listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
          className={`fixed left-0 right-0 z-50 bg-black md:inset-0 md:flex md:items-center 
                     md:justify-center transition-opacity duration-300
                     ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onClick={handleClose}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            top: `${modalPosition}px`,
            height: '80vh',
            maxHeight: '80vh',
            opacity: Math.max(0, 1 - Math.abs(dragDistance.y) / 400),
            transform: `translateY(${dragDistance.y}px)`,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Previous button - explicitly visible on all screens */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 text-white hover:text-gray-300 z-50 p-2
                       bg-black bg-opacity-50 rounded-full flex items-center justify-center
                       transition-transform duration-200 hover:scale-110
                       sm:flex xs:flex block" // Explicitly show on all screens
            >
              <i className="fas fa-chevron-left text-xl"></i>
            </button>

            {/* Image container */}
            <div 
              className="relative w-full aspect-[4/3] transition-transform duration-300"
              style={{
                transform: `translateX(${dragDistance.x}px)`,
              }}
            >
              <Image
                src={selectedImage}
                alt="SkyZone activity"
                fill
                className={`object-contain transition-transform duration-300
                          ${slideDirection === 'left' ? 'animate-slide-left' : ''}
                          ${slideDirection === 'right' ? 'animate-slide-right' : ''}`}
                sizes="100vw"
                priority
                quality={100}
                onClick={(e) => e.stopPropagation()}
                onTransitionEnd={handleImageTransitionEnd}
              />
            </div>

            {/* Next button - explicitly visible on all screens */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 text-white hover:text-gray-300 z-50 p-2
                       bg-black bg-opacity-50 rounded-full flex items-center justify-center
                       transition-transform duration-200 hover:scale-110
                       sm:flex xs:flex block" // Explicitly show on all screens
            >
              <i className="fas fa-chevron-right text-xl"></i>
            </button>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-50 p-2
                       bg-black bg-opacity-50 rounded-full
                       transition-transform duration-200 hover:scale-110"
            >
              <i className="fas fa-times text-xl"></i>
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
