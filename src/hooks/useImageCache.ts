import { useState, useEffect } from 'react';

const CACHE_NAME = 'photo-gallery-cache-v1';

export const useImageCache = (images: string[]) => {
  const [cachedImages, setCachedImages] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const cacheImages = async () => {
      // Check if Cache API is available
      if (!('caches' in window)) {
        return;
      }

      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponses = await Promise.all(
          images.map(async (imageUrl) => {
            // Check if image is already in cache
            const match = await cache.match(imageUrl);
            if (!match) {
              // If not in cache, fetch and cache it
              const response = await fetch(imageUrl);
              await cache.put(imageUrl, response.clone());
              return { [imageUrl]: true };
            }
            return { [imageUrl]: true };
          })
        );

        // Update state with cached status
        const cachedStatus = cachedResponses.reduce((acc, curr) => ({
          ...acc,
          ...curr
        }), {});
        setCachedImages(cachedStatus);
      } catch (error) {
        console.error('Error caching images:', error);
      }
    };

    cacheImages();
  }, [images]);

  return cachedImages;
};