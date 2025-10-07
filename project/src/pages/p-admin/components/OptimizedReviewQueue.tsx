import React, { useState, useEffect } from 'react';
import styles from './OptimizedReviewQueue.module.css';

interface ReviewData {
  id: string;
  dataType: string;
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  notes?: string;
  taskId?: string;
  source: 'dataReview' | 'cozeReview' | 'collectionTask';
}

interface TabConfig {
  key: 'pending' | 'reviewed';
  label: string;
  icon: string;
  status: string[];
}

const OptimizedReviewQueue: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const tabs: TabConfig[] = [
    {
      key: 'pending',
      label: '审核中',
      icon: '⏳',
      status: ['pending']
    },
    {
      key: 'reviewed',
      label: '已审核',
      icon: '✅',
      status: ['approved', 'rejected']
    }
  ];

  const dataTypeLabels: Record<string, string> = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店',
    city_overview: '城市概览',
    general: '通用数据'
  };

  const statusLabels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // 获取当前tab对应的状态
      const currentTab = tabs.find(tab => tab.key === activeTab);
      const statusFilter = currentTab?.status.join(',') || 'pending';
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        status: statusFilter
      });
      
      // 并行获取所有数据源
      const [dataReviewRes, cozeReviewRes, collectionTaskRes] = await Promise.all([
        fetch(`/api/v1/admin/reviews?${params}`).then(res => res.json()),
        fetch(`/api/v1/admin/coze-reviews?${params}`).then(res => res.json()),
        fetchCollectionTaskReviews(params)
      ]);

      // 整合所有数据
      const allReviews: ReviewData[] = [];
      
      // 处理 DataReview 数据
      if (dataReviewRes.status === 'success' && dataReviewRes.data.reviews) {
        dataReviewRes.data.reviews.forEach((review: any) => {
          allReviews.push({
            ...review,
            source: 'dataReview',
            submittedAt: review.createdAt || review.submittedAt
          });
        });
      }

      // 处理 CozeReviewData 数据
      if (cozeReviewRes.status === 'success' && cozeReviewRes.data.reviews) {
        cozeReviewRes.data.reviews.forEach((review: any) => {
          allReviews.push({
            ...review,
            source: 'cozeReview'
          });
        });
      }

      // 处理 CollectionTask 数据
      if (collectionTaskRes.length > 0) {
        collectionTaskRes.forEach((review: any) => {
          allReviews.push({
            ...review,
            source: 'collectionTask'
          });
        });
      }

      // 按时间排序
      allReviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      // 分页处理
      const total = allReviews.length;
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedReviews = allReviews.slice(startIndex, startIndex + pageSize);

      setReviews(paginatedReviews);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize));
      
    } catch (error) {
      console.error('获取审核列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionTaskReviews = async (params: URLSearchParams) => {
    try {
      // 获取已完成的采集任务
      const tasksRes = await fetch('/api/v1/admin/data-collection/tasks');
      const tasksData = await tasksRes.json();
      
      if (tasksData.status !== 'success') return [];
      
      const completedTasks = tasksData.data.tasks.filter((task: any) => 
        task.status === 'completed' && task.cozeResponse?.data
      );

      const reviews: ReviewData[] = [];
      
      for (const task of completedTasks) {
        if (task.cozeResponse?.data && Array.isArray(task.cozeResponse.data)) {
          task.cozeResponse.data.forEach((item: any, index: number) => {
            reviews.push({
              id: `${task.id}-${index}`,
              taskId: task.id,
              dataType: 'general',
              status: 'pending',
              data: item,
              submittedAt: task.createdAt,
              source: 'collectionTask'
            });
          });
        }
      }
      
      return reviews;
    } catch (error) {
      console.error('获取采集任务审核数据失败:', error);
      return [];
    }
  };

  const handleTabChange = (tabKey: 'pending' | 'reviewed') => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };



  const handleViewDetail = (review: ReviewData) => {
    setSelectedReview(review);
    setReviewNotes(review.notes || '');
    setShowDetailModal(true);
  };

  const handleReview = async (reviewId: string, action: 'approve' | 'reject', notes: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      let apiUrl = '';
      let method = 'PUT';
      
      // 根据数据源选择不同的API
      switch (review.source) {
        case 'dataReview':
          apiUrl = `/api/v1/admin/reviews/${reviewId}`;
          method = 'POST';
          break;
        case 'cozeReview':
          apiUrl = `/api/v1/admin/coze-reviews/${reviewId}`;
          break;
        case 'collectionTask':
          // 对于采集任务数据，需要特殊处理
          alert('采集任务数据审核功能正在开发中');
          return;
      }

      const response = await fetch(apiUrl, {
        method,
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
        setSelectedReview(null);
        setReviewNotes('');
        fetchReviews(); // 重新获取数据
      } else {
        alert('审核操作失败: ' + result.message);
      }
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('审核操作失败');
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

  const renderDataPreview = (data: any, dataType: string) => {
    if (!data) return <p>无数据</p>;

    return (
      <div className={styles.dataPreview}>
        <h4>{data.name || data.title || '未知名称'}</h4>
        {data.description && <p><strong>描述:</strong> {data.description}</p>}
        {data.location && <p><strong>位置:</strong> {data.location}</p>}
        {data.address && <p><strong>地址:</strong> {data.address}</p>}
        {data.price && <p><strong>价格:</strong> {data.price}</p>}
        {data.category && <p><strong>类别:</strong> {data.category}</p>}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

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
          onClick={() => setCurrentPage(i)}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          上一页
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
        <h1>数据审核</h1>
        <div className={styles.stats}>
          <span>共 {totalCount} 条数据</span>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>



      {/* 审核列表 */}
      <div className={styles.reviewList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewInfo}>
                <span className={styles.dataType}>
                  {dataTypeLabels[review.dataType] || review.dataType}
                </span>
                <span className={`${styles.status} ${styles[review.status]}`}>
                  {statusLabels[review.status]}
                </span>
                <span className={styles.source}>
                  来源: {review.source === 'dataReview' ? '数据审核' : 
                         review.source === 'cozeReview' ? 'Coze采集' : '采集任务'}
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
          {activeTab === 'pending' ? '暂无待审核数据' : '暂无已审核数据'}
        </div>
      )}

      {renderPagination()}

      {/* 详情模态框 */}
      {showDetailModal && selectedReview && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>审核详情 - {dataTypeLabels[selectedReview.dataType] || selectedReview.dataType}</h2>
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
                <p><strong>数据来源:</strong> {
                  selectedReview.source === 'dataReview' ? '数据审核' : 
                  selectedReview.source === 'cozeReview' ? 'Coze采集' : '采集任务'
                }</p>
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
              
              {selectedReview.status === 'pending' && selectedReview.source !== 'collectionTask' && (
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

export default OptimizedReviewQueue;