import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const shouldBeVisible = scrollTop > 300;
      
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
        gsap.to(buttonRef.current, {
          opacity: shouldBeVisible ? 1 : 0,
          duration: 0.3,
          ease: 'power2.out'
        });
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
