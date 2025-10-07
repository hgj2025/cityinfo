import React, { useState, useEffect } from 'react';
import styles from './ReviewQueue.module.css';
import api from '../../../services/api';

interface ReviewData {
  id: string;
  dataType: 'attraction' | 'restaurant' | 'hotel';
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  notes?: string;
  taskId?: string;
}

const ReviewQueue: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const dataTypeLabels = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店'
  };

  const statusLabels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, selectedType, selectedStatus]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString()
      });
      
      if (selectedType) params.append('dataType', selectedType);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const result = await api.get(`/admin/reviews?${params}`);
      
      if (result.status === 'success') {
        setReviews(result.data.reviews);
        setTotalCount(result.data.total);
        setTotalPages(Math.ceil(result.data.total / pageSize));
      } else {
        console.error('获取审核列表失败:', result.message);
      }
    } catch (error) {
      console.error('获取审核列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetail = (review: ReviewData) => {
    setSelectedReview(review);
    setReviewNotes(review.notes || '');
    setShowDetailModal(true);
  };

  const handleReview = async (reviewId: string, action: 'approve' | 'reject', notes: string) => {
    try {
      const response = await fetch(`/api/v1/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          notes
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setShowDetailModal(false);
        fetchReviews();
        alert(`数据${action === 'approve' ? '审核通过' : '审核拒绝'}成功`);
      } else {
        alert('操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleQuickApprove = async (review: ReviewData) => {
    if (!confirm('确定要快速通过这条数据吗？')) {
      return;
    }
    await handleReview(review.id, 'approve', '快速审核通过');
  };

  const handleQuickReject = async (review: ReviewData) => {
    const reason = prompt('请输入拒绝原因：');
    if (reason === null) return;
    if (!reason.trim()) {
      alert('请输入拒绝原因');
      return;
    }
    await handleReview(review.id, 'reject', reason);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const renderDataPreview = (data: any, type: string) => {
    switch (type) {
      case 'attraction':
        return (
          <div className={styles.dataPreview}>
            <h4>{data.name}</h4>
            <p><strong>类别:</strong> {data.category}</p>
            <p><strong>地址:</strong> {data.address}</p>
            <p><strong>描述:</strong> {data.description}</p>
            <p><strong>评分:</strong> {data.rating}</p>
            <p><strong>门票:</strong> {data.ticketPrice}</p>
          </div>
        );
      case 'restaurant':
        return (
          <div className={styles.dataPreview}>
            <h4>{data.name}</h4>
            <p><strong>菜系:</strong> {data.cuisine}</p>
            <p><strong>地址:</strong> {data.address}</p>
            <p><strong>描述:</strong> {data.description}</p>
            <p><strong>评分:</strong> {data.rating}</p>
            <p><strong>价格:</strong> {data.priceRange}</p>
          </div>
        );
      case 'hotel':
        return (
          <div className={styles.dataPreview}>
            <h4>{data.name}</h4>
            <p><strong>星级:</strong> {data.starRating}星</p>
            <p><strong>地址:</strong> {data.address}</p>
            <p><strong>描述:</strong> {data.description}</p>
            <p><strong>评分:</strong> {data.rating}</p>
            <p><strong>价格:</strong> {data.priceRange}</p>
          </div>
        );
      default:
        return <div className={styles.dataPreview}>未知数据类型</div>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          上一页
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          下一页
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>审核队列</h1>
        <div className={styles.stats}>
          <span>共 {totalCount} 条待审核数据</span>
        </div>
      </div>

      <div className={styles.filters}>
        <select
          value={selectedType}
          onChange={handleTypeFilter}
          className={styles.filter}
        >
          <option value="">所有类型</option>
          <option value="attraction">景点</option>
          <option value="restaurant">餐厅</option>
          <option value="hotel">酒店</option>
        </select>
        <select
          value={selectedStatus}
          onChange={handleStatusFilter}
          className={styles.filter}
        >
          <option value="">所有状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>

      <div className={styles.reviewList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewInfo}>
                <span className={styles.dataType}>
                  {dataTypeLabels[review.dataType]}
                </span>
                <span className={`${styles.status} ${styles[review.status]}`}>
                  {statusLabels[review.status]}
                </span>
              </div>
              <div className={styles.reviewDate}>
                提交时间: {formatDate(review.submittedAt)}
              </div>
            </div>
            
            <div className={styles.reviewContent}>
              {renderDataPreview(review.data, review.dataType)}
            </div>
            
            {review.reviewedAt && (
              <div className={styles.reviewResult}>
                <p><strong>审核时间:</strong> {formatDate(review.reviewedAt)}</p>
                {review.reviewerName && (
                  <p><strong>审核人:</strong> {review.reviewerName}</p>
                )}
                {review.notes && (
                  <p><strong>审核备注:</strong> {review.notes}</p>
                )}
              </div>
            )}
            
            <div className={styles.reviewActions}>
              <button 
                onClick={() => handleViewDetail(review)}
                className={styles.detailButton}
              >
                查看详情
              </button>
              {review.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleQuickApprove(review)}
                    className={styles.approveButton}
                  >
                    快速通过
                  </button>
                  <button 
                    onClick={() => handleQuickReject(review)}
                    className={styles.rejectButton}
                  >
                    快速拒绝
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className={styles.empty}>
          {selectedType || selectedStatus ? '没有找到匹配的审核数据' : '暂无审核数据'}
        </div>
      )}

      {totalPages > 1 && renderPagination()}

      {/* 详情模态框 */}
      {showDetailModal && selectedReview && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>审核详情 - {dataTypeLabels[selectedReview.dataType]}</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3>数据信息</h3>
                <div className={styles.dataDetail}>
                  <pre>{JSON.stringify(selectedReview.data, null, 2)}</pre>
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <h3>审核信息</h3>
                <p><strong>提交时间:</strong> {formatDate(selectedReview.submittedAt)}</p>
                <p><strong>当前状态:</strong> 
                  <span className={`${styles.status} ${styles[selectedReview.status]}`}>
                    {statusLabels[selectedReview.status]}
                  </span>
                </p>
                {selectedReview.reviewedAt && (
                  <>
                    <p><strong>审核时间:</strong> {formatDate(selectedReview.reviewedAt)}</p>
                    {selectedReview.reviewerName && (
                      <p><strong>审核人:</strong> {selectedReview.reviewerName}</p>
                    )}
                  </>
                )}
              </div>
              
              {selectedReview.status === 'pending' && (
                <div className={styles.detailSection}>
                  <h3>审核操作</h3>
                  <div className={styles.reviewForm}>
                    <div className={styles.formGroup}>
                      <label>审核备注</label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="请输入审核备注..."
                        rows={3}
                      />
                    </div>
                    <div className={styles.reviewButtons}>
                      <button 
                        onClick={() => handleReview(selectedReview.id, 'approve', reviewNotes)}
                        className={styles.approveButton}
                      >
                        审核通过
                      </button>
                      <button 
                        onClick={() => handleReview(selectedReview.id, 'reject', reviewNotes)}
                        className={styles.rejectButton}
                      >
                        审核拒绝
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedReview.notes && (
                <div className={styles.detailSection}>
                  <h3>审核备注</h3>
                  <p>{selectedReview.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;