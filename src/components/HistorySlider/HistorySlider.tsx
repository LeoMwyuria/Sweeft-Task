import { useRef, useState } from 'react';
import { scrollSlider } from '../../animations/sliderAnimations';
import { formatTimeAgo, truncateText } from '../../utils/helper';
import { HistorySliderProps } from '../../interfaces';


export const HistorySlider = ({ items, selectedTerm, onTermClick }: HistorySliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showArrows = items.length > 6;

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
                <span className="timestamp">{formatTimeAgo(item.timestamp)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="desktop-slider">
        {showArrows && (
          <button className="slider-arrow left" onClick={() => scrollSlider(sliderRef.current, 'left')}>←</button>
        )}
        <div className="history-slider" ref={sliderRef}>
          {items.map((item, index) => (
            <button
              key={index}
              className={`history-term ${selectedTerm === item.term ? 'active' : ''}`}
              onClick={() => onTermClick(item.term)}
              title={item.term}
            >
              {truncateText(item.term, 14)}
              <span className="timestamp">{formatTimeAgo(item.timestamp)}</span>
            </button>
          ))}
        </div>
        {showArrows && (
          <button className="slider-arrow right" onClick={() => scrollSlider(sliderRef.current, 'right')}>→</button>
        )}
      </div>
    </div>
  );
};
