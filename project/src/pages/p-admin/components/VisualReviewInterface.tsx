import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewList, ReviewDetail, ImageDisplaySection } from './VisualReview';
import { useReviewData } from './VisualReview/hooks';
import styles from './VisualReviewInterface.module.css';

const VisualReviewInterface: React.FC = () => {
  const navigate = useNavigate();
  const {
    reviews,
    loading,
    selectedReview,
    currentPage,
    totalPages,
    fetchReviews,
    fetchCollectionTaskReviews,
    handleSelectReview
  } = useReviewData();

  return (
    <div className={styles.container}>
      {/* 左侧审核列表 */}
      <div className={styles.sidebar}>
        <ReviewList
          reviews={reviews}
          loading={loading}
          selectedReview={selectedReview}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelectReview={handleSelectReview}
          onPageChange={(page) => {
            const path = window.location.pathname;
            if (path.includes('collection-task-reviews')) {
              fetchCollectionTaskReviews(page);
            } else {
              fetchReviews(page);
            }
          }}
        />
      </div>

      {/* 右侧详情区域 */}
      <div className={styles.mainContent}>
        {selectedReview && (
          <>
            <div className={styles.detailHeader}>
              <h2>审核详情</h2>
              <div className={styles.detailMeta}>
                <span>ID: {selectedReview.id}</span>
                <span>状态: {selectedReview.status}</span>
                <span>创建时间: {new Date(selectedReview.submittedAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>
            <div className={styles.detailContent}>
              <div className={styles.basicInfoSection}>
                <ReviewDetail data={selectedReview} />
              </div>
              <div className={styles.imageGallerySection}>
                <ImageDisplaySection data={selectedReview} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VisualReviewInterface;