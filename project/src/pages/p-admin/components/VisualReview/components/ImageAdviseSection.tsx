import React from 'react';
import { ImageAdviseSectionProps } from '../types';
import styles from '../../VisualReviewInterface.module.css';

const ImageAdviseSection: React.FC<ImageAdviseSectionProps> = ({
  data,
  selectedPictures,
  onPictureToggle
}) => {
  return (
    <>
      {/* 运营选中的图片 */}
      <div className={`${styles.detailColumn} ${styles.selectedImagesColumn}`}>
        <h3>运营选中的图片</h3>
        <div className={styles.selectedImagesSection}>
          {Object.keys(selectedPictures).length > 0 ? (
            Object.entries(selectedPictures).map(([adviseIndex, pictureIndices]) => {
              const pictures = data?.pictures || [];
              const adviseText = data?.pictureAdvises?.[parseInt(adviseIndex)];
              
              return (
                <div key={adviseIndex} className={styles.selectedAdviseGroup}>
                  <div className={styles.adviseTitle}>
                    建议 {parseInt(adviseIndex) + 1}: {adviseText}
                  </div>
                  <div className={styles.selectedImagesList}>
                    {pictureIndices.map((picIndex: number) => {
                      const globalIndex = parseInt(adviseIndex) * 3 + picIndex;
                      const picture = pictures[globalIndex];
                      if (!picture) return null;
                      
                      return (
                        <div key={picIndex} className={styles.selectedImageItem}>
                          <div className={styles.imageContainer}>
                            <img 
                              src={picture.display_url} 
                              alt={picture.title}
                              className={styles.selectedImage}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                          <div className={styles.imageInfo}>
                            <div className={styles.imageTitle}>{picture.title}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>暂无选中的图片</div>
          )}
        </div>
      </div>

      {/* 所有图片建议 */}
      <div className={`${styles.detailColumn} ${styles.allImagesColumn}`}>
        <h3>所有图片建议</h3>
        <div className={styles.allImagesSection}>
          {data?.pictureAdvises?.map((advise: string, adviseIndex: number) => {
            const pictures = data?.pictures || [];
            const startIndex = adviseIndex * 3;
            const endIndex = Math.min(startIndex + 3, pictures.length);
            const advisePictures = pictures.slice(startIndex, endIndex);
            
            return (
              <div key={adviseIndex} className={styles.adviseGroup}>
                <div className={styles.adviseTitle}>
                  建议 {adviseIndex + 1}: {advise}
                </div>
                <div className={styles.adviseImages}>
                  {advisePictures.map((picture: any, pictureIndex: number) => {
                    const isSelected = selectedPictures[adviseIndex]?.includes(pictureIndex);
                    
                    return (
                      <div 
                        key={pictureIndex} 
                        className={`${styles.adviseImageItem} ${isSelected ? styles.selected : ''}`}
                        onClick={() => onPictureToggle(adviseIndex, pictureIndex)}
                      >
                        <div className={styles.imageContainer}>
                          <img 
                            src={picture.display_url} 
                            alt={picture.title}
                            className={styles.adviseImage}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className={styles.selectOverlay}>
                            {isSelected ? '✓' : '○'}
                          </div>
                        </div>
                        <div className={styles.imageInfo}>
                          <div className={styles.imageTitle}>{picture.title}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }) || <div className={styles.emptyState}>暂无图片建议</div>}
        </div>
      </div>
    </>
  );
};

export default ImageAdviseSection;