import { useState, useEffect } from 'react';
import { PhotoGrid } from '../../components/PhotoGrid/PhotoGrid';
import { Modal } from '../../components/Modal/Modal';
import { Photo, SearchHistory } from '../../interfaces';
import { searchPhotos } from '../../services/unsplash';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export const History = () => {
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [cache, setCache] = useState<Record<string, Photo[]>>(() => {
    const savedCache = localStorage.getItem('photoCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });

  const loadPhotos = async () => {
    if (!selectedTerm) return;
    
    try {
      const newPhotos = await searchPhotos(selectedTerm, page);
      setPhotos(prev => [...prev, ...newPhotos]);
      setPage(prev => prev + 1);
      
      const updatedCache = {
        ...cache,
        [selectedTerm]: [...(cache[selectedTerm] || []), ...newPhotos]
      };
      setCache(updatedCache);
      localStorage.setItem('photoCache', JSON.stringify(updatedCache));
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const { isFetching, setIsFetching } = useInfiniteScroll(loadPhotos);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [photos, isFetching, setIsFetching]);

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
    setPage(1);
    
    if (cache[term]) {
      setPhotos(cache[term]);
    } else {
      setPhotos([]);
      loadPhotos();
    }
  };

  return (
    <div className="history">
      {searchHistory.length === 0 ? (
        <div className="no-results">
          <h3>No search history yet</h3>
          <p>Start searching for photos to build your history</p>
        </div>
      ) : (
        <div className="history-terms">
          {searchHistory.map((item, index) => (
            <button
              key={index}
              className={`history-term ${selectedTerm === item.term ? 'active' : ''}`}
              onClick={() => handleTermClick(item.term)}
            >
              {item.term}
              <span className="timestamp">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedTerm && photos.length === 0 && (
        <div className="no-results">
          <h3>No photos found for "{selectedTerm}"</h3>
        </div>
      )}

      {selectedTerm && photos.length > 0 && (
        <PhotoGrid 
          photos={photos} 
          onPhotoClick={setSelectedPhoto} 
        />
      )}

      {selectedPhoto && (
        <Modal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </div>
  );
};