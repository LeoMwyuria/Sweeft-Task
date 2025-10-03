import gsap from 'gsap';

export const animateHeader = () => {
  gsap.fromTo("#header", 
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
  );
};
