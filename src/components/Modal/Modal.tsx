import { Photo } from '../../interfaces';

interface ModalProps {
  photo: Photo;
  onClose: () => void;
}

export const Modal = ({ photo, onClose }: ModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <img 
          src={photo.urls.full} 
          alt={`Photo by ${photo.user.name}`} 
          className="modal-image"
        />
        <div className="photo-info">
          <div className="photo-stats">
            <span>❤️ {photo.likes.toLocaleString()}</span>
          </div>
          <div className="photographer">
            Photo by: {photo.user.name}
          </div>
        </div>
      </div>
    </div>
  );
};