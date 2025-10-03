import { useRef, useState } from 'react';
import gsap from 'gsap';
import { SearchHistory } from '../../interfaces';

interface HistorySliderProps {
  items: SearchHistory[];
  selectedTerm: string;
  onTermClick: (term: string) => void;
}

export const HistorySlider = ({ items, selectedTerm, onTermClick }: HistorySliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const truncateText = (text: string, limit: number) => 
    text.length > limit ? `${text.slice(0, limit)}...` : text;

  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
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

  return (
    <div className="history-slider-container">
      <div className="mobile-dropdown">
        <button 
          className="dropdown-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          History ↓
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            {items.map((item, index) => (
              <button
                key={index}
                className={`dropdown-item ${selectedTerm === item.term ? 'active' : ''}`}
                onClick={() => {
                  onTermClick(item.term);
                  setIsDropdownOpen(false);
                }}
                title={item.term}
              >
                {truncateText(item.term, 20)}
                <span className="timestamp">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="desktop-slider">
        <button className="slider-arrow left" onClick={() => scroll('left')}>←</button>
        <div className="history-slider" ref={sliderRef}>
          {items.map((item, index) => (
            <button
              key={index}
              className={`history-term ${selectedTerm === item.term ? 'active' : ''}`}
              onClick={() => onTermClick(item.term)}
              title={item.term}
            >
              {truncateText(item.term, 14)}
              <span className="timestamp">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => scroll('right')}>→</button>
      </div>
    </div>
  );
};
