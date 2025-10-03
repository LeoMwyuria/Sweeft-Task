import { useRef,  useState } from 'react';
import gsap from 'gsap';

interface SearchProps {
  onSearch: (value: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsActive(true);
    gsap.to(wrapperRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleBlur = () => {
    setIsActive(false);
    gsap.to(wrapperRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className={`search-wrapper ${isActive ? 'active' : ''}`} ref={wrapperRef}>
      <input 
        ref={inputRef}
        type="text"
        className="search-input glass-effect"
        placeholder="Explore visuals..."
        onChange={(e) => onSearch(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};
