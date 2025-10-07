import React from 'react';
import { ReviewListProps } from '../types';
import { extractImages, extractTextInfo, formatDate } from '../utils';
import styles from '../../VisualReviewInterface.module.css';

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading,
  selectedReview,
  currentPage,
  totalPages,
  onSelectReview,
  onPageChange
}) => {
  const dataTypeLabels: Record<string, string> = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店',
    city_overview: '城市概览',
    general: '通用数据'
  };
  return (
    <div className={styles.reviewList}>
      <h2>待审核列表</h2>
      {reviews.map((review) => {
        const imageGroups = extractImages(review.data);
        const totalImages = imageGroups.reduce((sum, group) => sum + group.images.length, 0);
        const textInfo = extractTextInfo(review.data);
        
        return (
          <div 
            key={review.id} 
            className={`${styles.reviewItem} ${selectedReview?.id === review.id ? styles.selected : ''}`}
            onClick={() => onSelectReview(review)}
          >
            <div className={styles.reviewHeader}>
              <span className={styles.dataType}>
                {dataTypeLabels[review.dataType] || review.dataType}
              </span>
              <span className={styles.imageCount}>
                📷 {totalImages}
              </span>
            </div>
            
            <div className={styles.reviewTitle}>
              {textInfo.name || textInfo.title || textInfo.attraction_name || 
               textInfo.city || textInfo.location || textInfo.place || 
               (textInfo.pictureAdvises && Array.isArray(textInfo.pictureAdvises) ? 
                 `${textInfo.city || '城市'} - ${textInfo.pictureAdvises.length}张图片建议` : 
                 '数据审核项目')}
            </div>
            
            <div className={styles.reviewMeta}>
              <span>{formatDate(review.submittedAt)}</span>
              <span className={styles.source}>
                {review.source === 'dataReview' ? '数据审核' : '采集任务'}
              </span>
            </div>
            
            {/* 预览图片 */}
            {imageGroups.length > 0 && (
              <div className={styles.previewImages}>
                {imageGroups[0].images.slice(0, 3).map((url, index) => (
                  <img 
                    key={index}
                    src={url} 
                    alt={`预览 ${index + 1}`}
                    className={styles.previewImage}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ))}
                {totalImages > 3 && (
                  <div className={styles.moreImages}>
                    +{totalImages - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {loading && (
        <div className={styles.loading}>加载中...</div>
      )}
      
      {!loading && reviews.length === 0 && (
        <div className={styles.empty}>暂无待审核数据</div>
      )}
      
      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={styles.pageButton}
          >
            上一页
          </button>
          <span className={styles.pageInfo}>
            第 {currentPage} 页 / 共 {totalPages} 页
          </span>
          <button 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={styles.pageButton}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;