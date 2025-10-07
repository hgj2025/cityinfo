import React from 'react';
import { ReviewData } from '../types';
import { extractImages } from '../utils';
import styles from '../../VisualReviewInterface.module.css';

interface ImageDisplaySectionProps {
  data: ReviewData;
}

const ImageDisplaySection: React.FC<ImageDisplaySectionProps> = ({ data }) => {
  const imageGroups = extractImages(data);
  
  // 从图片组中提取所有图片URL
  const getAllImageUrls = () => {
    const allUrls: string[] = [];
    imageGroups.forEach(group => {
      allUrls.push(...group.images);
    });
    return [...new Set(allUrls)]; // 去重
  };
  
  // 从数据中提取运营选中的图片
  const getSelectedImages = () => {
    const selectedImages: string[] = [];
    
    // 检查各个字段中的选中图片
    if (data.selectedImages && Array.isArray(data.selectedImages)) {
      selectedImages.push(...data.selectedImages);
    }
    
    // 如果有其他选中图片的字段，可以在这里添加
    if (data.recommendedImages && Array.isArray(data.recommendedImages)) {
      selectedImages.push(...data.recommendedImages);
    }
    
    return [...new Set(selectedImages)]; // 去重
  };

  const selectedImages = getSelectedImages();
  const allImages = getAllImageUrls();

  const renderImageGrid = (images: string[], title: string) => {
    if (images.length === 0) {
      return (
        <div className={styles.emptyImageGrid}>
          <p>暂无{title}</p>
        </div>
      );
    }

    return (
      <div className={styles.imageGrid}>
        {images.map((imageUrl, index) => (
          <div key={index} className={styles.imageItem}>
            <img
              src={imageUrl}
              alt={`${title} ${index + 1}`}
              className={styles.thumbnailImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.imageSection}>
      <div className={styles.imageColumns}>
        <div className={styles.selectedImagesColumn}>
          <h3>运营选中图片 ({selectedImages.length})</h3>
          {renderImageGrid(selectedImages, '运营选中图片')}
        </div>
        <div className={styles.allImagesColumn}>
          <h3>所有可选图集 ({allImages.length})</h3>
          {renderImageGrid(allImages, '可选图片')}
        </div>
      </div>
    </div>
  );
};

export default ImageDisplaySection;