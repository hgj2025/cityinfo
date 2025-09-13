
export interface Review {
  id: string;
  userName: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface NearbyItem {
  id: string;
  name: string;
  type: string;
  distance: string;
  image: string;
  link: string;
}

export interface FoodDetail {
  id: string;
  title: string;
  rating: number;
  reviewCount: number;
  price: string;
  category: string;
  description: string;
  restaurantName: string;
  images: string[];
}