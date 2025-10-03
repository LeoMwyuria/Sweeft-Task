import gsap from 'gsap';

export const animatePhotoGrid = (gridRef: React.RefObject<HTMLDivElement>, prevPhotosLength: React.MutableRefObject<number>, photosLength: number) => {
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

    prevPhotosLength.current = photosLength;
  }
};

export const animatePhotoTitle = (titleElement: HTMLDivElement, show: boolean) => {
  if (show) {
    gsap.fromTo(
      titleElement,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  } else {
    gsap.to(titleElement, { 
      opacity: 0, 
      y: 20, 
      duration: 0.3, 
      ease: "power2.in" 
    });
  }
};
