
export type FilterType = 'all' | 'city' | 'attraction' | 'food' | 'accommodation';

export interface SearchResultItem {
  id: string;
  type: 'city' | 'attraction' | 'food' | 'accommodation';
  title: string;
  description: string;
  image: string;
  location: string;
  rating?: number;
  price?: string;
  link: string;
}