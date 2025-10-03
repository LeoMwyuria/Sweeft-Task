import { useState, useEffect, useCallback, useRef } from 'react';
import { Photo, SearchHistory } from '../../interfaces';
import { PhotoGrid } from '../../components/PhotoGrid/PhotoGrid';
import { Modal } from '../../components/Modal/Modal';
import { Search } from '../../components/Search/Search';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { getPopularPhotos, searchPhotos } from '../../services/unsplash';

export const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [cache, setCache] = useState<Record<string, Photo[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const saveToHistory = (term: string) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [
      { term, timestamp: Date.now() },
      ...history.filter((item: SearchHistory) => item.term !== term)
    ].slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const loadPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const newPhotos = query 
        ? await searchPhotos(query, page)
        : await getPopularPhotos(page);
      
      setPhotos(prev => [...prev, ...newPhotos]);
      setPage(prev => prev + 1);
      
      if (query) {
        setCache(prev => ({
          ...prev,
          [query]: [...(prev[query] || []), ...newPhotos]
        }));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, page]);

  const { isFetching, setIsFetching } = useInfiniteScroll(loadPhotos);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [photos, isFetching, setIsFetching]);

  useEffect(() => {
    if (query.trim()) {
      saveToHistory(query.trim());
    }
    
    if (cache[query]) {
      setPhotos(cache[query]);
    } else {
      setPhotos([]);
      setPage(1);
      loadPhotos();
    }
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  return (
    <div className="home">
      <Search onSearch={handleSearch} />

      {isLoading && photos.length === 0 && (
        <div className="loading">
          <h3>Loading photos...</h3>
        </div>
      )}
      
      {photos.length === 0 && query && !isLoading && (
        <div className="no-results">
          <h3>No photos found for "{query}"</h3>
          <p>Try searching with different keywords</p>
        </div>
      )}
      
      <PhotoGrid 
        photos={photos} 
        onPhotoClick={setSelectedPhoto} 
      />
      
      {selectedPhoto && (
        <Modal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </div>
  );
};