"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ImagePreloader } from '../services/imagePreloader';

type ImagePreloaderContextType = {
  preloader: ImagePreloader;
  isImageLoaded: (src: string) => boolean;
};

const ImagePreloaderContext = createContext<ImagePreloaderContextType | null>(null);

export const ImagePreloaderProvider: React.FC<{ 
  children: React.ReactNode;
  images?: string[];
}> = ({ children, images = [] }) => {  // Add default empty array
  const [preloader] = useState(() => new ImagePreloader());

  useEffect(() => {
    if (images && images.length > 0) {  // Add safety check
      // Start preloading all images in the background
      Promise.all(images.map(src => preloader.preloadImage(src)))
        .catch(console.error); // Handle errors silently
    }
  }, [images, preloader]);

  return (
    <ImagePreloaderContext.Provider value={{ 
      preloader,
      isImageLoaded: (src) => preloader.isLoaded(src)
    }}>
      {children}
    </ImagePreloaderContext.Provider>
  );
};

export const useImagePreloader = () => {
  const context = useContext(ImagePreloaderContext);
  if (!context) {
    throw new Error('useImagePreloader must be used within ImagePreloaderProvider');
  }
  return context;
};