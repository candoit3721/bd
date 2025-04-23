"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SKYZONE_IMAGES } from '../constants/images';

type ImagePreloaderContextType = {
  loadedImages: Set<string>;
  setLoadedImage: (src: string) => void;
};

const ImagePreloaderContext = createContext<ImagePreloaderContextType | null>(null);

export const ImagePreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const setLoadedImage = (src: string) => {
    setLoadedImages(prev => new Set([...prev, src]));
  };

  return (
    <ImagePreloaderContext.Provider value={{ loadedImages, setLoadedImage }}>
      {children}
    </ImagePreloaderContext.Provider>
  );
};

export const useImagePreloader = () => {
  const context = useContext(ImagePreloaderContext);
  
  if (typeof window === 'undefined') {
    // Return a dummy context during server-side rendering
    return {
      loadedImages: new Set<string>(),
      setLoadedImage: () => {}
    };
  }

  if (!context) {
    throw new Error('useImagePreloader must be used within ImagePreloaderProvider');
  }

  return context;
};