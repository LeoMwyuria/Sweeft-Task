import gsap from 'gsap';

export const scrollSlider = (slider: HTMLDivElement | null, direction: 'left' | 'right') => {
  if (!slider) return;
  
  const scrollAmount = slider.clientWidth * 0.6;
  const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
  const targetScroll = direction === 'left' 
    ? Math.max(0, slider.scrollLeft - scrollAmount)
    : Math.min(maxScrollLeft, slider.scrollLeft + scrollAmount);

  gsap.to(slider, { 
    scrollLeft: targetScroll, 
    duration: 0.1, 
    ease: "power2.out" 
  });
};
