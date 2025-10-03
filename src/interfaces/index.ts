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


export interface HistorySliderProps {
    items: SearchHistory[];
    selectedTerm: string;
    onTermClick: (term: string) => void;
  }

  export interface ModalProps {
  photo: Photo;
  onClose: () => void;
}

export interface PhotoStats {
  views: number;
  downloads: number;
}
export interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}
export interface SearchProps {
  onSearch: (value: string) => void;
}