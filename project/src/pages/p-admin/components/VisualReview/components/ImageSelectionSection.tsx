import React from 'react';
import { ImageSelectionSectionProps } from '../types';
import styles from '../../VisualReviewInterface.module.css';

const ImageSelectionSection: React.FC<ImageSelectionSectionProps> = ({
  selectedImages,
  imageFilter,
  onImageToggle,
  onSelectAll,
  onDeselectAll,
  onFilterChange
}) => {
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

  const filteredImages = getFilteredImages();

  return (
    <div className={styles.imageSection}>
      <div className={styles.imageSectionHeader}>
        <h3>图片内容</h3>
        <div className={styles.imageControls}>
          <div className={styles.imageFilters}>
            <button 
              className={imageFilter === 'all' ? styles.active : ''}
              onClick={() => onFilterChange('all')}
            >
              全部 ({selectedImages.length})
            </button>
            <button 
              className={imageFilter === 'selected' ? styles.active : ''}
              onClick={() => onFilterChange('selected')}
            >
              已选 ({selectedImages.filter(img => img.selected).length})
            </button>
            <button 
              className={imageFilter === 'unselected' ? styles.active : ''}
              onClick={() => onFilterChange('unselected')}
            >
              未选 ({selectedImages.filter(img => !img.selected).length})
            </button>
          </div>
          <div className={styles.batchActions}>
            <button onClick={onSelectAll} className={styles.batchButton}>
              全选
            </button>
            <button onClick={onDeselectAll} className={styles.batchButton}>
              全不选
            </button>
          </div>
        </div>
      </div>

      <div className={styles.imageGrid}>
        {filteredImages.map((image, index) => (
          <div 
            key={index} 
            className={`${styles.imageItem} ${image.selected ? styles.selectedImage : ''}`}
            onClick={() => onImageToggle(image.url)}
          >
            <img 
              src={image.url} 
              alt={`图片 ${index + 1}`}
              className={styles.reviewImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className={styles.imageOverlay}>
              <div className={styles.imageGroup}>{image.group}</div>
              <div className={styles.selectIndicator}>
                {image.selected ? '✓' : '○'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectionSection;