import { useEffect, useState, useRef } from 'react';
import { animateScrollButton } from '../../animations/scrollToTopAnimations';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeVisible = window.scrollY > 300;
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
        animateScrollButton(buttonRef, shouldBeVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      ref={buttonRef}
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
};
