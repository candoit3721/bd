export class ImagePreloader {
  private cache: Map<string, HTMLImageElement> = new Map();

  preloadImage(src: string): Promise<void> {
    if (this.cache.has(src)) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        resolve();
      };

      img.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error);
        reject(error);
      };

      img.src = src;
    });
  }

  isLoaded(src: string): boolean {
    const cachedImage = this.cache.get(src);
    return this.cache.has(src) && (cachedImage?.complete ?? false);
  }

  getImage(src: string): HTMLImageElement | undefined {
    return this.cache.get(src);
  }
}