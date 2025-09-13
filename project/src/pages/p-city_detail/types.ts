
export interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  price: string;
  imageUrl: string;
}

export interface Food {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface Accommodation {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  price: string;
  imageUrl: string;
  amenities: string[];
}

export interface TransportRoute {
  type: string;
  price: string;
  time: string;
  route: string;
}

export interface TransportConnection {
  from: string;
  to: string;
  routes: TransportRoute[];
}

export interface CityData {
  id: string;
  name: string;
  slogan: string;
  imageUrl: string;
}