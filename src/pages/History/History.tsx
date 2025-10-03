import { useState, useEffect } from 'react';
import { PhotoGrid } from '../../components/PhotoGrid/PhotoGrid';
import { Modal } from '../../components/Modal/Modal';
import { Photo, SearchHistory } from '../../interfaces';
import { searchPhotos } from '../../services/unsplash';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { HistorySlider } from '../../components/Sliders/HistorySlider';

export const History = () => {
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, Photo[]>>(() => {
    const savedCache = localStorage.getItem('photoCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });

  const loadPhotos = async () => {
    if (!selectedTerm) return;
    
    try {
      const newPhotos = await searchPhotos(selectedTerm, page);
      setPhotos(prev => page === 1 ? newPhotos : [...prev, ...newPhotos]);
      setPage(prev => prev + 1);
      
      if (!cache[selectedTerm]) {
        const updatedCache = {
          ...cache,
          [selectedTerm]: newPhotos
        };
        setCache(updatedCache);
        localStorage.setItem('photoCache', JSON.stringify(updatedCache));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const { isFetching, setIsFetching } = useInfiniteScroll(loadPhotos);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
    if (history.length > 0) {
      const mostRecentTerm = history[0].term;
      setSelectedTerm(mostRecentTerm);
      handleTermClick(mostRecentTerm);
    }
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [photos, isFetching, setIsFetching]);

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
    setPage(1);
    
    if (cache[term]) {
      setIsInitialLoading(false);
      setPhotos(cache[term]);
      return;
    }
    
    setIsInitialLoading(true);
    setPhotos([]);
    
    searchPhotos(term, 1).then(newPhotos => {
      setPhotos(newPhotos);
      setIsInitialLoading(false);
      
      const updatedCache = {
        ...cache,
        [term]: newPhotos
      };
      setCache(updatedCache);
      localStorage.setItem('photoCache', JSON.stringify(updatedCache));
    });
  };

  return (
    <div className="history">
      {searchHistory.length === 0 ? (
        <div className="no-results">
          <h3>No search history yet</h3>
          <p>Start searching for photos to build your history</p>
        </div>
      ) : (
        <HistorySlider 
          items={searchHistory}
          selectedTerm={selectedTerm}
          onTermClick={handleTermClick}
        />
      )}

      {selectedTerm && photos.length === 0 && (
        <div className="no-results">
          {isInitialLoading ? (
            <h3>Loading photos...</h3>
          ) : (
            <h3>No photos found for "{selectedTerm}"</h3>
          )}
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
