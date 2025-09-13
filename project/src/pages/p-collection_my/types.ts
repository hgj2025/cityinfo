
export interface CollectionItem {
  id: string;
  type: 'city' | 'attraction' | 'food' | 'accommodation';
  title: string;
  description: string;
  imageUrl: string;
  collectionDate: string;
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  status: 'generated';
  generationDate: string;
}

export interface UserInfo {
  displayName: string;
  email: string;
  preferredLanguage: string;
}