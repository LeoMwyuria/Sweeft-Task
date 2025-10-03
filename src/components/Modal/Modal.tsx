import { useEffect, useRef, useState } from 'react';
import { ModalProps, PhotoStats } from '../../interfaces';
import likeIcon from '../../assets/like.png';
import viewIcon from '../../assets/view.png';
import downloadIcon from '../../assets/download.png';
import closeImg from '../../assets/close.png';
import { animateOpen, animateClose } from '../../animations/modalAnimations';

export const Modal = ({ photo, onClose }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [photoStats, setPhotoStats] = useState<PhotoStats>({ views: 0, downloads: 0 });

  useEffect(() => {
    fetch(`https://api.unsplash.com/photos/${photo.id}/statistics`, {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setPhotoStats({
          views: data.views.total || 0,
          downloads: data.downloads.total || 0
        });
      });
  }, [photo.id]);

  useEffect(() => {
    animateOpen(overlayRef, contentRef);
  }, []);

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={() => animateClose(overlayRef, contentRef, onClose)}>
      <div className="modal-container" ref={contentRef} onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={() => animateClose(overlayRef, contentRef, onClose)}>
          <img src={closeImg} alt="Close modal" />
        </button>

        <div className="modal-content">
          <div className="modal-image-wrapper">
            <img 
              src={photo.urls.regular} 
              alt={photo.alt_description || 'Photo'} 
              className="modal-image"
            />
          </div>

          <div className="modal-info">
            <div className="modal-text">
              <h3 className="photo-title">
                {photo.description || photo.alt_description || 'Untitled'}
              </h3>
              <h4 className="photographer">By {photo.user.name}</h4>
            </div>

            <div className="stats">
              <div className="stat">
                <img src={likeIcon} alt="likes" className="stat-icon" />
                <span>{photo.likes}</span>
              </div>
              <div className="stat">
                <img src={viewIcon} alt="views" className="stat-icon" />
                <span>{photoStats.views}</span>
              </div>
              <div className="stat">
                <img src={downloadIcon} alt="downloads" className="stat-icon" />
                <span>{photoStats.downloads}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
