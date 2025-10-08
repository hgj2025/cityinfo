import React from 'react';
import { ImageSelectionSectionProps } from '../types';
import styles from '../../VisualReviewInterface.module.css';

const ImageSelectionSection: React.FC<ImageSelectionSectionProps> = ({
  selectedImages
}) => {
  return (
    <div className={styles.imageSection}>
      <div className={styles.imageSectionHeader}>
        <h3>图片内容</h3>
        <div className={styles.imageControls}>
          <span className={styles.imageCount}>共 {selectedImages.length} 张图片</span>
        </div>
      </div>

      <div className={styles.imageGrid}>
        {selectedImages.map((image, index) => (
          <div 
            key={index} 
            className={styles.imageItem}
            draggable={true}
            onDragStart={(e) => {
              console.log('=== 开始拖拽图片 ===');
              console.log('图片URL:', image.url);
              console.log('图片组:', image.group);
              
              try {
                // 直接传输图片URL，利用浏览器的默认行为
                e.dataTransfer.setData('text/plain', image.url);
                e.dataTransfer.setData('text/uri-list', image.url);
                e.dataTransfer.effectAllowed = 'copy';
                
                console.log('拖拽URL设置成功:', image.url);
                console.log('设置的数据类型:', e.dataTransfer.types);
              } catch (error) {
                console.error('设置拖拽数据时发生错误:', error);
              }
            }}
            onDragEnd={(e) => {
              console.log('拖拽结束');
            }}
            title="拖拽到基本信息区域进行配图"
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
              <div className={styles.dragIndicator}>
                ⋮⋮
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectionSection;