import { useState, useEffect, useCallback } from 'react';
import { Photo, SearchHistory } from '../../interfaces';
import { PhotoGrid } from '../../components/PhotoGrid/PhotoGrid';
import { Modal } from '../../components/Modal/Modal';
import { Search } from '../../components/Search/Search';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { getPopularPhotos, searchPhotos } from '../../services/unsplash';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';

export const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [cache, setCache] = useState<Record<string, Photo[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const saveToHistory = (term: string) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [
      { term, timestamp: Date.now() },
      ...history.filter((item: SearchHistory) => item.term !== term)
    ].slice(0, 50);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        setQuery(inputValue);
        saveToHistory(inputValue);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const loadPhotos = useCallback(async () => {
    if (isLoadingMore) return;
  
    try {
      setIsLoading(true);
      setIsLoadingMore(true);
  
      const newPhotos = query 
        ? await searchPhotos(query, page)
        : await getPopularPhotos(page);
  
      setCache(prev => ({
        ...prev,
        [query]: page === 1 
          ? newPhotos 
          : [...(prev[query] || []), ...newPhotos]
      }));
  
      setPhotos(prev => {
        const mergedPhotos = page === 1 ? newPhotos : [...prev, ...newPhotos];
        const uniquePhotos = Array.from(new Map(mergedPhotos.map(p => [p.id, p])).values());
        return uniquePhotos;
      });
  
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [query, page, isLoadingMore]);
  

  const { isFetching, setIsFetching } = useInfiniteScroll(loadPhotos);

  useEffect(() => {
    if (!isFetching || isLoadingMore) return;
    setPage(prevPage => prevPage + 1);
  }, [isFetching, isLoadingMore]);

  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      if (cache[query]) {
        setPhotos(cache[query]);
      } else {
        setPhotos([]);
        loadPhotos();
      }
    } else {
      setPhotos([]);
      setPage(1);
      loadPhotos();
    }
  }, [query]);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [photos]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    if (!value.trim()) {
      setQuery('');
    }
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
      <ScrollToTop />
    </div>
  );
};
