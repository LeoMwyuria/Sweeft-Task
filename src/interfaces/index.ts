export interface Photo {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  user: {
    name: string;
  };
  likes: number;
  views: number;
  downloads: number;
  description: string | null;
  alt_description: string | null;
  links: {
    html: string;
  };
}


  export interface SearchHistory {
    term: string;
    timestamp: number;
  }