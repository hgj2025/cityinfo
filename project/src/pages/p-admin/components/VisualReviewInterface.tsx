import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewList, ReviewDetail, ImageDisplaySection } from './VisualReview';
import { useReviewData } from './VisualReview/hooks';
import { adminService } from '../../../services/admin';
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

  // 处理审核操作
  const handleReviewAction = async (action: 'approve' | 'reject') => {
    if (!selectedReview) return;
    
    try {
      console.log(`${action === 'approve' ? '审核通过' : '审核拒绝'}:`, selectedReview.id);
      
      // 调用审核API
      const result = await adminService.reviewData(selectedReview.id, {
        action,
        notes: action === 'approve' ? '审核通过' : '审核拒绝',
        reviewerId: 'admin'
      });
      
      if (result.status === 'success') {
        alert(`数据已${action === 'approve' ? '通过' : '拒绝'}审核`);
        
        // 刷新列表
        const path = window.location.pathname;
        if (path.includes('collection-task-reviews')) {
          fetchCollectionTaskReviews(currentPage);
        } else {
          fetchReviews(currentPage);
        }
      } else {
        alert('审核失败: ' + (result.message || '未知错误'));
      }
    } catch (error: any) {
      console.error('审核操作失败:', error);
      const errorMessage = error.response?.data?.message || error.message || '审核操作失败';
      alert('审核操作失败: ' + errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 左侧审核列表 */}
        <div className={styles.reviewList}>
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
        <div className={styles.reviewDetail}>
          {selectedReview ? (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.headerTop}>
                  <h2>审核详情</h2>
                  <div className={styles.reviewActions}>
                    <button 
                      className={`${styles.reviewButton} ${styles.approveButton}`}
                      onClick={() => handleReviewAction('approve')}
                      disabled={selectedReview.status !== 'pending'}
                    >
                      审核通过
                    </button>
                    <button 
                      className={`${styles.reviewButton} ${styles.rejectButton}`}
                      onClick={() => handleReviewAction('reject')}
                      disabled={selectedReview.status !== 'pending'}
                    >
                      审核拒绝
                    </button>
                  </div>
                </div>
                <div className={styles.detailMeta}>
                  <span>ID: {selectedReview.id}</span>
                  {selectedReview.taskId && <span>任务ID: {selectedReview.taskId}</span>}
                  <span>状态: {selectedReview.status}</span>
                  <span>创建时间: {new Date(selectedReview.createdAt).toLocaleString()}</span>
                  <span>更新时间: {new Date(selectedReview.updatedAt).toLocaleString()}</span>
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
          ) : (
            <div className={styles.noSelection}>
              <h2>请选择待审核项目</h2>
              <p>从左侧列表中选择一个项目开始审核</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualReviewInterface;