import { Photo } from '../../interfaces';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export const PhotoGrid = ({ photos, onPhotoClick }: PhotoGridProps) => {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="photo-item"
          onClick={() => onPhotoClick(photo)}
        >
          <img 
            src={photo.urls.regular} 
            alt={`Photo by ${photo.user.name}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};