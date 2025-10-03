import gsap from 'gsap';

export const animateOpen = (overlayRef: React.RefObject<HTMLDivElement>, contentRef: React.RefObject<HTMLDivElement>) => {
  if (!overlayRef.current || !contentRef.current) return;

  gsap.set(contentRef.current, { scale: 0.8, opacity: 0 });
  gsap.set(overlayRef.current, { opacity: 0 });

  gsap.timeline()
    .to(overlayRef.current, { opacity: 1, duration: 0.1 })
    .to(contentRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
};

export const animateClose = (
  overlayRef: React.RefObject<HTMLDivElement>, 
  contentRef: React.RefObject<HTMLDivElement>, 
  onClose: () => void
) => {
  if (!overlayRef.current || !contentRef.current) return;

  gsap.timeline()
    .to(contentRef.current, { scale: 0.8, opacity: 0, duration: 0.2 })
    .to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
};
