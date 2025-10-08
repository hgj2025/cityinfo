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
        const textInfo = extractTextInfo(review.data);
        const cityName = textInfo.city || textInfo.location || textInfo.place || '未知城市';
        
        return (
          <div 
            key={review.id} 
            className={`${styles.reviewItem} ${selectedReview?.id === review.id ? styles.selected : ''}`}
            onClick={() => onSelectReview(review)}
          >
            <div className={styles.compactReviewContent}>
              <div className={styles.cityName}>
                {cityName}
              </div>
              <div className={styles.collectTime}>
                {formatDate(review.submittedAt)}
              </div>
            </div>
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