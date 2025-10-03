import gsap from 'gsap';

export const animateSearchFocus = (wrapperRef: React.RefObject<HTMLDivElement>, isFocused: boolean) => {
  gsap.to(wrapperRef.current, {
    scale: isFocused ? 1.1 : 1,
    duration: 0.3,
    ease: "power2.out"
  });
};
