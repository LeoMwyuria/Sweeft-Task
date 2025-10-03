import { useEffect, useRef } from 'react';
import { animatePhotoGrid, animatePhotoTitle } from '../../animations/photoGridAnimations';
import { PhotoGridProps } from '../../interfaces';


export const PhotoGrid = ({ photos, onPhotoClick }: PhotoGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const prevPhotosLength = useRef(0);

  useEffect(() => {
    animatePhotoGrid(gridRef, prevPhotosLength, photos.length);
  }, [photos]);

  return (
    <div className="photo-grid" ref={gridRef}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-item"
          onClick={() => onPhotoClick(photo)}
          onMouseEnter={(e) => animatePhotoTitle(e.currentTarget.querySelector('.photo-title')!, true)}
          onMouseLeave={(e) => animatePhotoTitle(e.currentTarget.querySelector('.photo-title')!, false)}
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
