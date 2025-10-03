import { useEffect, useRef } from 'react';
import { Photo } from '../../interfaces';
import gsap from 'gsap';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export const PhotoGrid = ({ photos, onPhotoClick }: PhotoGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const prevPhotosLength = useRef(0);

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('.photo-item');
    if (items) {
      const newItems = Array.from(items).slice(prevPhotosLength.current);
      
      gsap.fromTo(
        newItems,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.2,
          stagger: 0.1,
          ease: "power3.out"
        }
      );
      
      prevPhotosLength.current = photos.length;
    }
  }, [photos]);

  const handleMouseEnter = (titleElement: HTMLDivElement) => {
    gsap.fromTo(
      titleElement,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  };

  const handleMouseLeave = (titleElement: HTMLDivElement) => {
    gsap.to(titleElement, { 
      opacity: 0, 
      y: 20, 
      duration: 0.3, 
      ease: "power2.in" 
    });
  };

  return (
    <div className="photo-grid" ref={gridRef}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-item"
          onClick={() => onPhotoClick(photo)}
          onMouseEnter={(e) => handleMouseEnter(e.currentTarget.querySelector('.photo-title')!)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget.querySelector('.photo-title')!)}
        >
          <img
            src={photo.urls.small}
            alt={photo.alt_description || 'Photo'}
            loading="lazy"
          />
          <div className="photo-title">
            {photo.alt_description || 'Untitled'}
          </div>
        </div>
      ))}
    </div>
  );
};
