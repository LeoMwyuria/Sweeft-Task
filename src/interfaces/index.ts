export interface Photo {
    id: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
    };
    likes: number;
    user: {
      name: string;
      username: string;
    };
  }
  
  export interface SearchHistory {
    term: string;
    timestamp: number;
  }