import { useState, useEffect } from 'react';

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useRandomImages = (images: string[], count: number): string[] => {
  const [randomImages, setRandomImages] = useState<string[]>([]);

  useEffect(() => {
    const getRandomImages = () => {
      const shuffled = shuffleArray(images);
      return shuffled.slice(0, Math.min(count, images.length));
    };

    setRandomImages(getRandomImages());
  }, []); // Empty dependency array means this runs once on mount

  return randomImages;
};