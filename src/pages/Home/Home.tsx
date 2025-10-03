import { useState, useEffect, useCallback, useRef } from 'react';
import { Photo, SearchHistory } from '../../interfaces';
import { PhotoGrid } from '../../components/PhotoGrid/PhotoGrid';
import { Modal } from '../../components/Modal/Modal';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { getPopularPhotos, searchPhotos } from '../../services/unsplash';

export const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [cache, setCache] = useState<Record<string, Photo[]>>({});
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

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
    }
  }, [query, page]);

  const { isFetching, setIsFetching } = useInfiniteScroll(loadPhotos);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setQuery(value);
    }, 500);
  };

  return (
    <div className="home">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search photos..."
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {photos.length === 0 && query && (
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