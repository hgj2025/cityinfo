
export interface AccommodationDetails {
  name: string;
  type: string;
  area: string;
  priceRange: string;
  address: string;
  location: string;
  phone: string;
}

export interface SlideImage {
  src: string;
  alt: string;
  category?: string;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  accommodationId: string;
}

export interface ToastProps {
  message: string;
  show: boolean;
}

export interface NearbyAttraction {
  id: string;
  name: string;
  distance: string;
  image: string;
}

export interface UserReview {
  id: string;
  userName: string;
  userInitial: string;
  date: string;
  rating: number;
  comment: string;
}