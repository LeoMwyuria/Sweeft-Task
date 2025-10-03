import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface SearchProps {
  onSearch: (value: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const input = inputRef.current;

    const moveCursor = (e: MouseEvent) => {
      const { left, top, width, height } = input!.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      gsap.to(cursor, {
        x,
        y,
        duration: 0.8,
        ease: "expo.out"
      });
    };

    input?.addEventListener('mousemove', moveCursor);
    return () => input?.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div className="search-wrapper">
      <div className="cursor-follower" ref={cursorRef} />
      <input 
        ref={inputRef}
        type="text"
        className="search-input glass-effect"
        placeholder="Explore visuals..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};