export interface ReviewData {
  id: string;
  dataType: string;
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  notes?: string;
  taskId?: string;
  source: 'dataReview' | 'collectionTask';
}

export interface ImageGroup {
  title: string;
  images: string[];
}

export interface SelectedImage {
  url: string;
  group: string;
  selected: boolean;
}

export interface SelectedPictures {
  [adviseIndex: number]: number[];
}

export interface ReviewListProps {
  reviews: ReviewData[];
  loading: boolean;
  selectedReview: ReviewData | null;
  currentPage: number;
  totalPages: number;
  onSelectReview: (review: ReviewData) => void;
  onPageChange: (page: number) => void;
}

export interface ReviewDetailProps {
  data: ReviewData;
}

export interface TextInfoSectionProps {
  data: any;
}

export interface ImageSelectionSectionProps {
  selectedImages: SelectedImage[];
  imageFilter: 'all' | 'selected' | 'unselected';
  onImageToggle: (imageUrl: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onFilterChange: (filter: 'all' | 'selected' | 'unselected') => void;
}

export interface ImageAdviseSectionProps {
  data: any;
  selectedPictures: SelectedPictures;
  onPictureToggle: (adviseIndex: number, pictureIndex: number) => void;
}