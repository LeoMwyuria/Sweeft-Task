import axios from 'axios';
import { Photo } from '../interfaces';

const api = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
  }
});

export const getPopularPhotos = async (page: number): Promise<Photo[]> => {
  const response = await api.get('/photos', {
    params: {
      order_by: 'popular',
      page,
      per_page: 20 
    }
  });
  return response.data;
};

export const searchPhotos = async (query: string, page: number): Promise<Photo[]> => {
  const response = await api.get('/search/photos', {
    params: {
      query,
      page,
      per_page: 20
    }
  });
  return response.data.results;
};

export const getPhotoDetails = async (id: string): Promise<Photo> => {
  const response = await api.get(`/photos/${id}`);
  return response.data;
};
