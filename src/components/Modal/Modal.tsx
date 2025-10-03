import { useEffect, useRef, useState } from 'react';
import { Photo } from '../../interfaces';
import likeIcon from '../../assets/like.png';
import viewIcon from '../../assets/view.png';
import downloadIcon from '../../assets/download.png';
import gsap from 'gsap';

interface ModalProps {
  photo: Photo;
  onClose: () => void;
}

interface PhotoStats {
  views: number;
  downloads: number;
}

export const Modal = ({ photo, onClose }: ModalProps) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [photoStats, setPhotoStats] = useState<PhotoStats>({ views: 0, downloads: 0 });

  useEffect(() => {
    fetch(`https://api.unsplash.com/photos/${photo.id}`, {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setPhotoStats({
          views: data.views || 0,
          downloads: data.downloads || 0
        });
      });
  }, [photo.id]);

  useEffect(() => {
    gsap.set(contentRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(overlayRef.current, { opacity: 0 });

    const tl = gsap.timeline();
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.1
    })
    .to(contentRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline();
    tl.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose
    });
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="modal-container" ref={contentRef} onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>×</button>
        <div className="modal-content">
          <div className="modal-image">
            <img 
              src={photo.urls.regular} 
              alt={photo.alt_description || 'Photo'} 
              style={{ 
                maxHeight: '80vh', 
                maxWidth: '90vw',
                objectFit: 'contain' 
              }}
            />
          </div>
          <div className="modal-info">
            <h3>By {photo.user.name}</h3>
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
