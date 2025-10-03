import gsap from 'gsap';

export const animateScrollButton = (buttonRef: React.RefObject<HTMLButtonElement>, isVisible: boolean) => {
  gsap.to(buttonRef.current, {
    opacity: isVisible ? 1 : 0,
    duration: 0.3,
    ease: 'power2.out',
  });
};
