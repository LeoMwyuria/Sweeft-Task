import { useRef, useState } from 'react';
import { animateSearchFocus } from '../../animations/searchAnimations';
import searchIcon from '../../assets/search.png';
import { SearchProps } from '../../interfaces';

export const Search = ({ onSearch }: SearchProps) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsActive(true);
    animateSearchFocus(wrapperRef, true);
  };

  const handleBlur = () => {
    setIsActive(false);
    animateSearchFocus(wrapperRef, false);
  };

  return (
    <div className={`search-wrapper ${isActive ? 'active' : ''}`} ref={wrapperRef}>
      <img 
        src={searchIcon} 
        alt="search" 
        className="search-icon"
      />
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
