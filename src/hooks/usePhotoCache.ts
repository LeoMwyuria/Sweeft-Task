import { useState, useEffect } from 'react';
import { Photo } from '../interfaces';

export const usePhotoCache = () => {
  const [cache, setCache] = useState<Record<string, Photo[]>>(() => {
    const savedCache = localStorage.getItem('photoCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });

  useEffect(() => {
    localStorage.setItem('photoCache', JSON.stringify(cache));
  }, [cache]);

  const updateCache = (term: string, photos: Photo[]) => {
    setCache(prevCache => ({
      ...prevCache,
      [term]: photos
    }));
  };

  return { cache, updateCache };
};
