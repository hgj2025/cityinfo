import React, { useState, useEffect } from 'react';
import { adminService, CozeReviewData, ReviewRequest } from '../../../services/admin';
import styles from './UnifiedReview.module.css';

interface ReviewData {
  id: string;
  dataType: 'attraction' | 'restaurant' | 'hotel' | 'coze' | 'collection';
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  notes?: string;
  taskId?: string;
}

const UnifiedReview: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'collection'>('pending');
  const [selectedItem, setSelectedItem] = useState<ReviewData | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState<{[key: string]: string[]}>({});
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const pageSize = 10;

  const dataTypeLabels = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店',
    coze: 'Coze数据',
    collection: '采集任务'
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
      
      if (activeTab === 'collection') {
        // 如果是采集任务选项卡，需要先选择任务ID
        if (!selectedTaskId) {
          setReviews([]);
          setTotalCount(0);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        
        // 获取指定任务的采集数据
        const response = await adminService.getCollectionTaskReviews(selectedTaskId, currentPage, pageSize);
        const collectionReviews = (response.reviews || []).map(review => ({
          ...review,
          dataType: 'collection' as const
        }));
        
        setReviews(collectionReviews);
        setTotalCount(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / pageSize));
        
        // 初始化图片选择状态
        const initialSelectedImages: {[key: string]: string[]} = {};
        collectionReviews.forEach(review => {
          const itemData = typeof review.data === 'string' ? JSON.parse(review.data) : review.data;
          initialSelectedImages[review.id] = itemData.images || [];
        });
        setSelectedImages(initialSelectedImages);
        
        setLoading(false);
        return;
      }
      
      // 根据activeTab确定状态筛选
      const statusFilter = activeTab === 'pending' ? 'pending' : '';
      
      // 同时获取传统审核数据和Coze数据
      const [traditionalResponse, cozeResponse] = await Promise.all([
        // 获取传统审核数据
        (async () => {
          const params = new URLSearchParams({
            page: '1',
            limit: '1000' // 获取更多数据用于合并
          });
          
          if (statusFilter) params.append('status', statusFilter);
          if (activeTab === 'reviewed') {
            // 获取已审核的数据（已通过和已拒绝）
            params.delete('status');
            params.append('status', 'approved,rejected');
          }
          
          const response = await fetch(`http://localhost:3001/api/v1/admin/reviews?${params}`);
          const result = await response.json();
          return result.status === 'success' ? result.data.reviews || [] : [];
        })(),
        
        // 获取Coze数据
        (async () => {
          const response = await adminService.getCozeReviews(1, 1000);
          let cozeReviews = (response.reviews || []).map(review => ({
            ...review,
            dataType: 'coze' as const
          }));
          
          // 根据tab筛选数据
          if (activeTab === 'pending') {
            cozeReviews = cozeReviews.filter(review => review.status === 'pending');
          } else {
            cozeReviews = cozeReviews.filter(review => review.status !== 'pending');
          }
          
          return cozeReviews;
        })()
      ]);
      
      // 合并所有数据
      const allReviews = [...traditionalResponse, ...cozeResponse];
      
      // 按提交时间排序（最新的在前）
      allReviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      
      // 分页处理
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedReviews = allReviews.slice(startIndex, endIndex);
      
      setReviews(paginatedReviews);
      setTotalCount(allReviews.length);
      setTotalPages(Math.ceil(allReviews.length / pageSize));
      
      // 初始化Coze数据的图片选择状态
      const initialSelectedImages: {[key: string]: string[]} = {};
      paginatedReviews.forEach(review => {
        if (review.dataType === 'coze') {
          const itemData = typeof review.data === 'string' ? JSON.parse(review.data) : review.data;
          initialSelectedImages[review.id] = itemData.images || [];
        }
      });
      setSelectedImages(initialSelectedImages);
      
    } catch (error) {
      console.error('获取审核列表失败:', error);
      setReviews([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: ReviewData) => {
    setSelectedItem(item);
    setReviewNotes(item.notes || '');
    setShowPreview(false);
  };

  const handleImageToggle = (imageUrl: string) => {
    if (!selectedItem) return;
    
    const currentSelected = selectedImages[selectedItem.id] || [];
    const newSelected = currentSelected.includes(imageUrl)
      ? currentSelected.filter(url => url !== imageUrl)
      : [...currentSelected, imageUrl];
    
    setSelectedImages(prev => ({
      ...prev,
      [selectedItem.id]: newSelected
    }));
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedItem) return;

    try {
      if (selectedItem.dataType === 'coze' || selectedItem.dataType === 'collection') {
        const request: ReviewRequest = {
          action,
          notes: reviewNotes,
          selectedImages: selectedImages[selectedItem.id] || []
        };
        
        if (selectedItem.dataType === 'coze') {
          await adminService.reviewCozeData(selectedItem.id, request);
        } else {
          // 对于采集任务数据，暂时使用相同的审核逻辑
          // 后续可以根据需要添加专门的采集任务审核API
          await adminService.reviewCozeData(selectedItem.id, request);
        }
      } else {
        const response = await fetch(`/api/v1/admin/reviews/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
            notes: reviewNotes
          }),
        });
        
        const result = await response.json();
        if (result.status !== 'success') {
          throw new Error(result.message);
        }
      }

      alert(`数据${action === 'approve' ? '审核通过' : '审核拒绝'}成功`);
      setSelectedItem(null);
      setReviewNotes('');
      setShowPreview(false);
      fetchReviews();
    } catch (error) {
      console.error('审核操作失败:', error);
      alert('操作失败');
    }
  };

  const handleQuickApprove = async (review: ReviewData) => {
    if (!confirm('确定要快速通过这条数据吗？')) return;
    
    setSelectedItem(review);
    setReviewNotes('快速审核通过');
    await handleReview('approve');
  };

  const handleQuickReject = async (review: ReviewData) => {
    const reason = prompt('请输入拒绝原因：');
    if (reason === null || !reason.trim()) return;
    
    setSelectedItem(review);
    setReviewNotes(reason);
    await handleReview('reject');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const renderDataPreview = (data: any, type: string) => {
    if (type === 'coze' || type === 'collection') {
      const itemData = typeof data === 'string' ? JSON.parse(data) : data;
      return (
        <div className={styles.dataPreview}>
          <h4>{itemData.name}</h4>
          <p><strong>描述:</strong> {itemData.description}</p>
          <div className={styles.contentPreview}>
            <pre>{JSON.stringify(itemData.content, null, 2)}</pre>
          </div>
        </div>
      );
    }

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

  const renderImageGallery = () => {
    if (!selectedItem || (selectedItem.dataType !== 'coze' && selectedItem.dataType !== 'collection')) return null;
    
    const itemData = typeof selectedItem.data === 'string' ? JSON.parse(selectedItem.data) : selectedItem.data;
    const images = itemData.images || [];
    const currentSelectedImages = selectedImages[selectedItem.id] || [];

    if (images.length === 0) {
      return (
        <div className={styles.noImages}>
          暂无图片
        </div>
      );
    }

    return (
      <div className={styles.imageGallery}>
        <p className={styles.imageCount}>
          <i className="fas fa-images"></i>
          共 {images.length} 张图片，已选择 {currentSelectedImages.length} 张
        </p>
        <div className={styles.imageGrid}>
          {images.map((imageUrl: string, index: number) => (
            <div
              key={index}
              className={`${styles.imageItem} ${
                currentSelectedImages.includes(imageUrl) ? styles.selected : ''
              }`}
              onClick={() => handleImageToggle(imageUrl)}
            >
              <img src={imageUrl} alt={`图片 ${index + 1}`} />
              <div className={styles.imageOverlay}>
                {currentSelectedImages.includes(imageUrl) && (
                  <i className="fas fa-check"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
    return <div className={styles.loading}>加载中...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>数据审核</h1>
        <div className={styles.headerRight}>
          <div className={styles.stats}>
            共 {totalCount} 条数据，第 {currentPage} 页，共 {totalPages} 页
          </div>
          <button onClick={fetchReviews} className={styles.refreshButton}>
            刷新
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('pending');
              setCurrentPage(1);
            }}
          >
            审核中
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'reviewed' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('reviewed');
              setCurrentPage(1);
            }}
          >
            审核后
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'collection' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('collection');
              setCurrentPage(1);
            }}
          >
            采集任务
          </button>
        </div>
        
        {activeTab === 'collection' && (
          <div className={styles.taskSelector}>
            <label>选择采集任务ID:</label>
            <input
              type="text"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              placeholder="请输入任务ID，如：b1522f20-cd0f-420a-a534-e1fb31328b2c"
              className={styles.taskInput}
            />
            <button 
              onClick={fetchReviews}
              className={styles.loadButton}
              disabled={!selectedTaskId.trim()}
            >
              加载数据
            </button>
          </div>
        )}
      </div>



      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.reviewList}>
            {(reviews || []).map(item => (
              <div
                key={item.id}
                className={`${styles.reviewCard} ${selectedItem?.id === item.id ? styles.active : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewInfo}>
                    <span className={styles.dataType}>
                      {dataTypeLabels[item.dataType]}
                    </span>
                    <span className={`${styles.status} ${styles[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                  </div>
                  <div className={styles.reviewDate}>
                    {formatDate(item.submittedAt)}
                  </div>
                </div>

                <div className={styles.reviewContent}>
                  {(item.dataType === 'coze' || item.dataType === 'collection') ? (
                    (() => {
                      const itemData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
                      return (
                        <>
                          <h4>{itemData.name}</h4>
                          <p>{itemData.description}</p>
                          <div className={styles.imageCount}>
                            <i className="fas fa-images"></i>
                            {itemData.images?.length || 0} 张图片
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <>
                      <h4>{item.data.name}</h4>
                      <p>{item.data.description}</p>
                    </>
                  )}
                </div>

                {item.status === 'pending' && (
                  <div className={styles.quickActions}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickApprove(item);
                      }}
                      className={styles.approveButton}
                    >
                      快速通过
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickReject(item);
                      }}
                      className={styles.rejectButton}
                    >
                      快速拒绝
                    </button>
                  </div>
                )}
              </div>
            ))}

            {reviews.length === 0 && (
              <div className={styles.empty}>
                暂无审核数据
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightPanel}>
          {selectedItem ? (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>审核详情 - {dataTypeLabels[selectedItem.dataType]}</h2>
              </div>

              <div className={styles.section}>
                <h3>数据内容</h3>
                {renderDataPreview(selectedItem.data, selectedItem.dataType)}
              </div>

              {(selectedItem.dataType === 'coze' || selectedItem.dataType === 'collection') && (
                <div className={styles.section}>
                  <h3>配图管理</h3>
                  {renderImageGallery()}
                </div>
              )}

              {selectedItem.status === 'pending' && (
                <div className={styles.section}>
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
                    <div className={styles.actionButtons}>
                      <button 
                        onClick={() => handleReview('approve')}
                        className={styles.approveButton}
                        disabled={(selectedItem.dataType === 'coze' || selectedItem.dataType === 'collection') && (!selectedImages[selectedItem.id] || selectedImages[selectedItem.id].length === 0)}
                      >
                        审核通过
                      </button>
                      <button 
                        onClick={() => handleReview('reject')}
                        className={styles.rejectButton}
                      >
                        审核拒绝
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.reviewedAt && (
                <div className={styles.section}>
                  <h3>审核结果</h3>
                  <div className={styles.reviewResult}>
                    <p><strong>审核时间:</strong> {formatDate(selectedItem.reviewedAt)}</p>
                    {selectedItem.reviewerName && (
                      <p><strong>审核人:</strong> {selectedItem.reviewerName}</p>
                    )}
                    {selectedItem.notes && (
                      <p><strong>审核备注:</strong> {selectedItem.notes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noSelection}>
              <i className="fas fa-hand-pointer"></i>
              <p>请选择左侧列表中的数据进行审核</p>
            </div>
          )}
        </div>
      </div>

      {renderPagination()}
    </div>
  );
};

export default UnifiedReview;