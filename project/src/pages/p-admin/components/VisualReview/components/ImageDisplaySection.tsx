import React, { useState } from 'react';
import { ReviewData, ImageItem } from '../types';
import { extractImages } from '../utils';
import styles from '../../VisualReviewInterface.module.css';

interface ImageDisplaySectionProps {
  data: ReviewData;
}

const ImageDisplaySection: React.FC<ImageDisplaySectionProps> = ({ data }) => {
  const imageGroups = extractImages(data.data);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  
  // 从图片组中提取所有图片
  const getAllImages = () => {
    const allImages: ImageItem[] = [];
    imageGroups.forEach(group => {
      group.images.forEach(image => {
        if (typeof image === 'string') {
          allImages.push({ url: image, title: '未命名图片' });
        } else {
          allImages.push(image);
        }
      });
    });
    // 根据URL去重
    const uniqueImages = allImages.filter((image, index, self) => 
      index === self.findIndex(t => t.url === image.url)
    );
    return uniqueImages;
  };
  
  // 从数据中提取运营选中的图片
  const getSelectedImages = () => {
    const selectedImages: ImageItem[] = [];
    const actualData = data.data || {};
    
    // 检查各个字段中的选中图片
    if (actualData.selectedImages && Array.isArray(actualData.selectedImages)) {
      actualData.selectedImages.forEach(image => {
        if (typeof image === 'string') {
          selectedImages.push({ url: image, title: '运营选中图片' });
        } else if (typeof image === 'object' && image.url) {
          selectedImages.push(image);
        }
      });
    }
    
    // 如果有其他选中图片的字段，可以在这里添加
    if (actualData.recommendedImages && Array.isArray(actualData.recommendedImages)) {
      actualData.recommendedImages.forEach(image => {
        if (typeof image === 'string') {
          selectedImages.push({ url: image, title: '推荐图片' });
        } else if (typeof image === 'object' && image.url) {
          selectedImages.push(image);
        }
      });
    }
    
    // 根据URL去重
    const uniqueImages = selectedImages.filter((image, index, self) => 
      index === self.findIndex(t => t.url === image.url)
    );
    return uniqueImages;
  };

  const allImages = getAllImages();

  // 处理图片选择
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageUrl)) {
        newSet.delete(imageUrl);
      } else {
        newSet.add(imageUrl);
      }
      return newSet;
    });
  };

  const renderImageGrid = (images: ImageItem[], title: string) => {
    if (images.length === 0) {
      return (
        <div className={styles.emptyImageGrid}>
          <p>暂无{title}</p>
        </div>
      );
    }

    return (
      <div className={styles.compactImageGrid}>
        {images.map((image, index) => {
          const isSelected = selectedImages.has(image.url);
          return (
            <div 
              key={index} 
              className={`${styles.selectableImageItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleImageSelect(image.url)}
            >
              <div className={styles.selectionIndicator}></div>
              <img
                src={image.url}
                alt={image.title || `${title} ${index + 1}`}
                className={styles.thumbnailImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className={styles.imageTitle}>
                {image.title || '未命名图片'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.imageSection}>
      <div className={styles.singleImageColumn}>
        <h3>所有可选图集 ({allImages.length}) {selectedImages.size > 0 && (
          <span> - 已选择 {selectedImages.size} 张</span>
        )}</h3>
        {renderImageGrid(allImages, '可选图片')}
      </div>
    </div>
  );
};

export default ImageDisplaySection;