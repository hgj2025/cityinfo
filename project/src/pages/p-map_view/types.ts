
export interface Attraction {
  id: string;
  name: string;
  type: string;
}

export interface Food {
  id: string;
  name: string;
  price: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: string;
  price: string;
}

export interface CityData {
  id: string;
  name: string;
  description: string;
  image: string;
  attractions: Attraction[];
  foods: Food[];
  accommodations: Accommodation[];
}

export interface AttractionData {
  id: string;
  name: string;
  city: string;
  cityName: string;
  type: string;
  description: string;
  image: string;
  ticketPrice: string;
  openHours: string;
}

export interface MapMarkerProps {
  id: string;
  top: string;
  left: string;
  icon: 'city' | 'monument';
  label: string;
  onClick: (id: string) => void;
}

export interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | null;
  itemType: 'city' | 'attraction' | null;
  cityData: Record<string, CityData>;
  attractionData: Record<string, AttractionData>;
}

export interface MobileFilterButtonProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

export interface FilterButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}