import { useState, useEffect } from 'react';
import { PhotoGrid } from '../../components/PhotoGrid/PhotoGrid';
import { Modal } from '../../components/Modal/Modal';
import { Photo, SearchHistory } from '../../interfaces';
import { searchPhotos } from '../../services/unsplash';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { HistorySlider } from '../../components/HistorySlider/HistorySlider';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { usePhotoCache } from '../../hooks/usePhotoCache';

export const History = () => {
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const { cache, updateCache } = usePhotoCache();

  const loadPhotos = async () => {
    if (!selectedTerm) return;

    try {
      const newPhotos = await searchPhotos(selectedTerm, page);
      setPhotos(prev => [...prev, ...newPhotos]);
      setPage(prev => prev + 1);
      updateCache(selectedTerm, [...(cache[selectedTerm] || []), ...newPhotos]);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsInitialLoading(false);
      setIsFetching(false);
    }
  };
  const { isFetching, setIsFetching } = useInfiniteScroll(loadPhotos);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
    if (history.length > 0) {
      setSelectedTerm(history[0].term);
      handleTermClick(history[0].term);
    }
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [photos, isFetching, setIsFetching]);

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
    setPage(1);
    setIsFetching(false);

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
      updateCache(term, newPhotos);
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
      <ScrollToTop />
    </div>
  );
};
