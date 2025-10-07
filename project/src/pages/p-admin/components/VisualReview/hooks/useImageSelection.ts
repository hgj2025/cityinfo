import { useState, useEffect } from 'react';
import { SelectedImage, SelectedPictures, ReviewData } from '../types';
import { extractImages } from '../utils';

export const useImageSelection = (selectedReview: ReviewData | null) => {
  const [selectedPictures, setSelectedPictures] = useState<SelectedPictures>({});
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [imageFilter, setImageFilter] = useState<'all' | 'selected' | 'unselected'>('all');

  useEffect(() => {
    if (selectedReview?.data) {
      // 重置选择状态
      setSelectedPictures({});
      
      // 初始化图片选择状态
      const imageGroups = extractImages(selectedReview.data);
      const allImages: SelectedImage[] = [];
      imageGroups.forEach(group => {
        group.images.forEach(url => {
          allImages.push({
            url,
            group: group.title,
            selected: false
          });
        });
      });
      setSelectedImages(allImages);
    } else {
      setSelectedImages([]);
      setSelectedPictures({});
    }
  }, [selectedReview]);

  const handleImageToggle = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.map(img => 
        img.url === imageUrl 
          ? { ...img, selected: !img.selected }
          : img
      )
    );
  };

  const handleSelectAll = () => {
    setSelectedImages(prev => 
      prev.map(img => ({ ...img, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setSelectedImages(prev => 
      prev.map(img => ({ ...img, selected: false }))
    );
  };

  const getFilteredImages = () => {
    switch (imageFilter) {
      case 'selected':
        return selectedImages.filter(img => img.selected);
      case 'unselected':
        return selectedImages.filter(img => !img.selected);
      default:
        return selectedImages;
    }
  };

  const handlePictureToggle = (adviseIndex: number, pictureIndex: number) => {
    setSelectedPictures(prev => {
      const currentSelected = prev[adviseIndex] || [];
      const isSelected = currentSelected.includes(pictureIndex);
      
      if (isSelected) {
        // 取消选择
        return {
          ...prev,
          [adviseIndex]: currentSelected.filter(idx => idx !== pictureIndex)
        };
      } else {
        // 添加选择
        return {
          ...prev,
          [adviseIndex]: [...currentSelected, pictureIndex]
        };
      }
    });
  };

  return {
    selectedPictures,
    selectedImages,
    imageFilter,
    setImageFilter,
    handleImageToggle,
    handleSelectAll,
    handleDeselectAll,
    getFilteredImages,
    handlePictureToggle
  };
};