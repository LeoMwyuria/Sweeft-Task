import { useEffect, useRef } from 'react';
import { Photo } from '../../interfaces';
import gsap from 'gsap';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export const PhotoGrid = ({ photos, onPhotoClick }: PhotoGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const lastPhotosLength = useRef(0);

  useEffect(() => {
    if (!gridRef.current) return;

    const newItems = Array.from(gridRef.current.children).slice(lastPhotosLength.current);
    
    if (newItems.length > 0) {
      gsap.fromTo(
        newItems,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        }
      );
    }

    lastPhotosLength.current = photos.length;
  }, [photos]);

  return (
    <div className="photo-grid" ref={gridRef}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-item"
          onClick={() => onPhotoClick(photo)}
        >
          <img
            src={photo.urls.small}
            alt={photo.alt_description || 'Photo'}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
