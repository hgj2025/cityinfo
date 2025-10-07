import React, { useState, useEffect, useCallback } from 'react';
import { ReviewRequest } from '../../../services/admin';
import styles from './UnifiedReview.module.css';
import api from '../../../services/api';

interface ReviewData {
  id: string;
  dataType: 'attraction' | 'restaurant' | 'hotel' | 'data_review';
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  notes?: string;
  taskId?: string;
  createdAt?: string;
  created_at?: string;
}

const UnifiedReview: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [selectedItem, setSelectedItem] = useState<ReviewData | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState<{[key: string]: string[]}>({});
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const pageSize = 10;

  const dataTypeLabels = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店',
    data_review: '数据审核'
  };

  const dataTypeTabs = [
    { key: 'pending', label: '待审核', icon: '⏳' },
    { key: 'reviewed', label: '已审核', icon: '✅' }
  ];

  const statusLabels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  };

  // 统一的数据获取函数
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 统一从data_review端点获取数据（包含从coze采集的数据）
      const status = activeTab === 'pending' ? 'pending' : 'approved,rejected';
      const response = await api.get(`/admin/reviews?page=${currentPage}&limit=${pageSize}&status=${status}`);
      
      const reviewsData = (response.data?.reviews || []).map((item: any) => ({
        ...item,
        dataType: 'data_review' as const
      }));

      // 按时间排序
      const sortedReviews = reviewsData.sort((a, b) => 
        new Date(b.createdAt || b.created_at || b.submittedAt).getTime() - 
        new Date(a.createdAt || a.created_at || a.submittedAt).getTime()
      );

      setReviews(sortedReviews);
      setTotalCount(response.data?.total || sortedReviews.length);
      setTotalPages(response.data?.totalPages || Math.ceil(sortedReviews.length / pageSize));
      
      // 初始化图片选择状态
      const initialSelectedImages: {[key: string]: string[]} = {};
      sortedReviews.forEach(review => {
        const itemData = typeof review.data === 'string' ? JSON.parse(review.data) : review.data;
        initialSelectedImages[review.id] = itemData?.images || [];
      });
      setSelectedImages(initialSelectedImages);
      
    } catch (err) {
      console.error('获取审核数据失败:', err);
      setError('获取审核数据失败');
      setReviews([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSelectItem = useCallback((item: ReviewData) => {
    setSelectedItem(item);
    setReviewNotes(item.notes || '');
    setShowPreview(false);
  }, []);

  const handleImageToggle = useCallback((imageUrl: string) => {
    if (!selectedItem) return;
    
    const currentSelected = selectedImages[selectedItem.id] || [];
    const newSelected = currentSelected.includes(imageUrl)
      ? currentSelected.filter(url => url !== imageUrl)
      : [...currentSelected, imageUrl];
    
    setSelectedImages(prev => ({
      ...prev,
      [selectedItem.id]: newSelected
    }));
  }, [selectedItem, selectedImages]);

  // 统一的审核处理函数
  const handleReview = useCallback(async (action: 'approve' | 'reject') => {
    if (!selectedItem) return;

    try {
      const reviewData: ReviewRequest = {
        action,
        notes: reviewNotes,
        selectedImages: selectedImages[selectedItem.id] || []
      };

      await api.put(`/admin/reviews/${selectedItem.id}`, reviewData);

      alert(`数据${action === 'approve' ? '审核通过' : '审核拒绝'}成功`);
      setSelectedItem(null);
      setReviewNotes('');
      setShowPreview(false);
      await fetchReviews();
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('操作失败');
    }
  }, [selectedItem, reviewNotes, selectedImages, fetchReviews]);

  // 快速审核函数
  const handleQuickReview = useCallback(async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/admin/reviews/${reviewId}`, { action });
      await fetchReviews();
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('操作失败');
    }
  }, [fetchReviews]);

  // 批量审核函数
  const handleBatchReview = useCallback(async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) return;

    try {
      const promises = selectedItems.map(reviewId => 
        api.put(`/admin/reviews/${reviewId}`, { action })
      );

      await Promise.all(promises);
      setSelectedItems([]);
      await fetchReviews();
      alert(`批量${action === 'approve' ? '通过' : '拒绝'}成功`);
    } catch (error) {
      console.error('批量审核操作失败:', error);
      alert('批量操作失败');
    }
  }, [selectedItems, fetchReviews]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === reviews.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(reviews.map(r => r.id));
    }
  }, [selectedItems.length, reviews]);

  const handleItemSelect = useCallback((reviewId: string) => {
    setSelectedItems(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  }, []);

  const renderDataContent = (data: any) => {
    if (!data) return '无数据';
    
    const itemData = typeof data === 'string' ? JSON.parse(data) : data;
    
    return (
      <div className={styles.dataContent}>
        <h4>{itemData.name || itemData.title || '未命名'}</h4>
        {itemData.description && (
          <p className={styles.description}>{itemData.description}</p>
        )}
        {itemData.address && (
          <p className={styles.address}>地址: {itemData.address}</p>
        )}
        {itemData.images && itemData.images.length > 0 && (
          <div className={styles.images}>
            <span>图片: {itemData.images.length} 张</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.unifiedReview}>
      <div className={styles.header}>
        <h2>统一审核管理</h2>
        <p className={styles.subtitle}>数据采集自Coze，统一进入审核队列</p>
      </div>

      {/* 标签页 */}
      <div className={styles.tabs}>
        {dataTypeTabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => {
              setActiveTab(tab.key as 'pending' | 'reviewed');
              setCurrentPage(1);
            }}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 批量操作 */}
      {activeTab === 'pending' && reviews.length > 0 && (
        <div className={styles.batchActions}>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={selectedItems.length === reviews.length}
              onChange={handleSelectAll}
            />
            全选 ({selectedItems.length}/{reviews.length})
          </label>
          {selectedItems.length > 0 && (
            <div className={styles.batchButtons}>
              <button
                className={`${styles.batchBtn} ${styles.approve}`}
                onClick={() => handleBatchReview('approve')}
              >
                批量通过 ({selectedItems.length})
              </button>
              <button
                className={`${styles.batchBtn} ${styles.reject}`}
                onClick={() => handleBatchReview('reject')}
              >
                批量拒绝 ({selectedItems.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* 主要内容区域 */}
      <div className={styles.content}>
        {/* 列表区域 */}
        <div className={styles.listSection}>
          {reviews.length === 0 ? (
            <div className={styles.empty}>暂无数据</div>
          ) : (
            <>
              <div className={styles.reviewList}>
                {reviews.map(review => (
                  <div
                    key={review.id}
                    className={`${styles.reviewItem} ${selectedItem?.id === review.id ? styles.selected : ''}`}
                    onClick={() => handleSelectItem(review)}
                  >
                    {activeTab === 'pending' && (
                      <input
                        type="checkbox"
                        className={styles.itemCheckbox}
                        checked={selectedItems.includes(review.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleItemSelect(review.id);
                        }}
                      />
                    )}
                    
                    <div className={styles.reviewHeader}>
                      <span className={styles.dataType}>
                        {dataTypeLabels[review.dataType]}
                      </span>
                      <span className={`${styles.status} ${styles[review.status]}`}>
                        {statusLabels[review.status]}
                      </span>
                    </div>
                    
                    {renderDataContent(review.data)}
                    
                    <div className={styles.reviewMeta}>
                      <span className={styles.time}>
                        {new Date(review.createdAt || review.created_at || review.submittedAt).toLocaleString()}
                      </span>
                      {activeTab === 'pending' && (
                        <div className={styles.quickActions}>
                          <button
                            className={`${styles.quickBtn} ${styles.approve}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickReview(review.id, 'approve');
                            }}
                          >
                            通过
                          </button>
                          <button
                            className={`${styles.quickBtn} ${styles.reject}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickReview(review.id, 'reject');
                            }}
                          >
                            拒绝
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    上一页
                  </button>
                  <span>
                    第 {currentPage} 页，共 {totalPages} 页 (总计 {totalCount} 条)
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 详情区域 */}
        {selectedItem && (
          <div className={styles.detailSection}>
            <div className={styles.detailHeader}>
              <h3>审核详情</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.detailContent}>
              <div className={styles.itemInfo}>
                <h4>基本信息</h4>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>数据类型:</label>
                    <span>{dataTypeLabels[selectedItem.dataType]}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>状态:</label>
                    <span className={`${styles.status} ${styles[selectedItem.status]}`}>
                      {statusLabels[selectedItem.status]}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>提交时间:</label>
                    <span>{new Date(selectedItem.createdAt || selectedItem.created_at || selectedItem.submittedAt).toLocaleString()}</span>
                  </div>
                  {selectedItem.reviewedAt && (
                    <div className={styles.infoItem}>
                      <label>审核时间:</label>
                      <span>{new Date(selectedItem.reviewedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.dataDetail}>
                <h4>数据内容</h4>
                {renderDataContent(selectedItem.data)}
                
                {/* 图片选择 */}
                {(() => {
                  const itemData = typeof selectedItem.data === 'string' ? JSON.parse(selectedItem.data) : selectedItem.data;
                  if (itemData?.images && itemData.images.length > 0) {
                    return (
                      <div className={styles.imageSelection}>
                        <h5>图片选择</h5>
                        <div className={styles.imageGrid}>
                          {itemData.images.map((imageUrl: string, index: number) => (
                            <div
                              key={index}
                              className={`${styles.imageItem} ${
                                selectedImages[selectedItem.id]?.includes(imageUrl) ? styles.selected : ''
                              }`}
                              onClick={() => handleImageToggle(imageUrl)}
                            >
                              <img src={imageUrl} alt={`图片 ${index + 1}`} />
                              <div className={styles.imageOverlay}>
                                {selectedImages[selectedItem.id]?.includes(imageUrl) ? '✓' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* 审核操作 */}
              {selectedItem.status === 'pending' && (
                <div className={styles.reviewActions}>
                  <div className={styles.notesSection}>
                    <label htmlFor="reviewNotes">审核备注:</label>
                    <textarea
                      id="reviewNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="请输入审核备注..."
                      rows={3}
                    />
                  </div>
                  
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.actionBtn} ${styles.approve}`}
                      onClick={() => handleReview('approve')}
                    >
                      通过审核
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.reject}`}
                      onClick={() => handleReview('reject')}
                    >
                      拒绝审核
                    </button>
                  </div>
                </div>
              )}

              {/* 已审核的备注显示 */}
              {selectedItem.status !== 'pending' && selectedItem.notes && (
                <div className={styles.existingNotes}>
                  <h5>审核备注</h5>
                  <p>{selectedItem.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedReview;