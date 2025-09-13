
export interface AttractionImage {
  src: string;
  alt: string;
  category: string;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  description: string;
  rating: number;
  price: string;
  image: AttractionImage;
}

export interface ShoppingInfo {
  name: string;
  description: string;
  location: string;
  image: AttractionImage;
}

export interface ReviewInfo {
  id: string;
  author: string;
  initial: string;
  rating: number;
  date: string;
  content: string;
}