import React, { useState, useEffect } from 'react';
import { adminService, CozeReviewData, ReviewRequest } from '../../../services/admin';
import styles from './CozeDataReview.module.css';

interface PreviewData {
  name: string;
  description: string;
  content: any;
  selectedImages: string[];
}

const CozeDataReview: React.FC = () => {
  // 状态管理
  const [reviews, setReviews] = useState<CozeReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: string[] }>({});
  const [selectedItem, setSelectedItem] = useState<CozeReviewData | null>(null);
  const [previewData, setPreviewData] = useState<CozeReviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 常量定义
  const dataTypeLabels = {
    city_overview: '城市概览',
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店'
  };

  const statusLabels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  };

  // 数据获取
  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCozeReviews(currentPage, 10);
      setReviews(response.reviews);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      
      // 初始化选中的图片（默认选择所有图片）
      const initialSelectedImages: { [key: string]: string[] } = {};
      response.reviews.forEach(review => {
        initialSelectedImages[review.id] = review.data.images || [];
      });
      setSelectedImages(initialSelectedImages);
    } catch (error) {
      console.error('获取审核数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: CozeReviewData) => {
    setSelectedItem(item);
    const itemData = JSON.parse(item.data);
    setSelectedImages({ [item.id]: itemData.images || [] });
    setReviewNotes(item.notes || '');
    setShowPreview(false);
  };

  const handleImageToggle = (imageUrl: string) => {
    if (!selectedItem) return;
    
    setSelectedImages(prev => {
      const currentImages = prev[selectedItem.id] || [];
      if (currentImages.includes(imageUrl)) {
        return {
          ...prev,
          [selectedItem.id]: currentImages.filter(url => url !== imageUrl)
        };
      } else {
        return {
          ...prev,
          [selectedItem.id]: [...currentImages, imageUrl]
        };
      }
    });
  };

  const handlePreview = () => {
    if (!selectedItem) return;
    setShowPreview(true);
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedItem) return;

    try {
      const request: ReviewRequest = {
        action,
        notes: reviewNotes,
        selectedImages: action === 'approve' ? selectedImages[selectedItem.id] : undefined
      };
      
      await adminService.reviewCozeData(selectedItem.id, request);
      
      setSelectedItem(null);
      setSelectedImages({});
      setReviewNotes('');
      setShowPreview(false);
      fetchReviews();
      alert(`数据${action === 'approve' ? '审核通过' : '审核拒绝'}成功`);
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const renderDataPreview = (data: any, type: string) => {
    return (
      <div className={styles.dataPreview}>
        <h4>{data.name}</h4>
        <p><strong>描述:</strong> {data.description}</p>
        {data.content && (
          <div className={styles.contentPreview}>
            <strong>内容:</strong>
            <pre>{JSON.stringify(data.content, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  const renderImageGallery = () => {
    if (!selectedItem) return <div className={styles.noImages}>暂无配图</div>;
    
    const itemData = JSON.parse(selectedItem.data);
    if (!itemData.images || itemData.images.length === 0) {
      return <div className={styles.noImages}>暂无配图</div>;
    }

    const currentSelectedImages = selectedImages[selectedItem.id] || [];
    
    return (
      <div className={styles.imageGallery}>
        <h4>配图选择 ({currentSelectedImages.length}/{itemData.images.length})</h4>
        <div className={styles.imageGrid}>
          {itemData.images.map((imageUrl, index) => (
            <div 
              key={index} 
              className={`${styles.imageItem} ${currentSelectedImages.includes(imageUrl) ? styles.selected : ''}`}
              onClick={() => handleImageToggle(imageUrl)}
            >
              <img src={imageUrl} alt={`配图 ${index + 1}`} />
              <div className={styles.imageOverlay}>
                <div className={styles.checkbox}>
                  {currentSelectedImages.includes(imageUrl) && <i className="fas fa-check"></i>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (!selectedItem || !showPreview) return null;

    const itemData = JSON.parse(selectedItem.data);
    const previewData: PreviewData = {
      name: itemData.name,
      description: itemData.description,
      content: itemData.content,
      selectedImages: selectedImages[selectedItem.id] || []
    };

    return (
      <div className={styles.previewModal}>
        <div className={styles.previewContent}>
          <div className={styles.previewHeader}>
            <h2>预览 - {dataTypeLabels[selectedItem.dataType]}</h2>
            <button 
              onClick={() => setShowPreview(false)}
              className={styles.closeButton}
            >
              ×
            </button>
          </div>
          
          <div className={styles.previewBody}>
            {selectedItem.dataType === 'city_overview' ? (
              <CityOverviewPreview data={previewData} />
            ) : (
              <GeneralDataPreview data={previewData} type={selectedItem.dataType} />
            )}
          </div>
        </div>
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
        <h1>Coze数据审核</h1>
        <div className={styles.stats}>
          <span>共 {total} 条待审核数据</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* 左侧列表 */}
        <div className={styles.leftPanel}>
          <div className={styles.reviewList}>
            {reviews.map(item => (
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
                  {(() => {
                    const itemData = JSON.parse(item.data);
                    return (
                      <>
                        <h4>{itemData.name}</h4>
                        <p>{itemData.description}</p>
                        {itemData.images && (
                          <div className={styles.imageCount}>
                            <i className="fas fa-images"></i> {itemData.images.length} 张配图
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className={styles.empty}>暂无审核数据</div>
          )}
        </div>

        {/* 右侧详情 */}
        <div className={styles.rightPanel}>
          {selectedItem ? (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>{JSON.parse(selectedItem.data).name}</h2>
                <span className={`${styles.status} ${styles[selectedItem.status]}`}>
                  {statusLabels[selectedItem.status]}
                </span>
              </div>

              <div className={styles.detailContent}>
                {/* 基本信息 */}
                <div className={styles.section}>
                  <h3>基本信息</h3>
                  {renderDataPreview(JSON.parse(selectedItem.data), selectedItem.dataType)}
                </div>

                {/* 配图选择 */}
                <div className={styles.section}>
                  <h3>配图管理</h3>
                  {renderImageGallery()}
                </div>

                {/* 审核操作 */}
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
                          onClick={handlePreview}
                          className={styles.previewButton}
                          disabled={selectedImages.length === 0}
                        >
                          预览效果
                        </button>
                        <button 
                          onClick={() => handleReview('approve')}
                          className={styles.approveButton}
                          disabled={selectedImages.length === 0}
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
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <i className="fas fa-hand-pointer"></i>
              <p>请选择左侧列表中的数据进行审核</p>
            </div>
          )}
        </div>
      </div>

      {/* 预览模态框 */}
      {renderPreview()}
    </div>
  );
};

// 城市概览预览组件
const CityOverviewPreview: React.FC<{ data: PreviewData }> = ({ data }) => {
  return (
    <div className={styles.cityOverviewPreview}>
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <i className="fas fa-info-circle text-accent mr-2"></i>{data.name}概览
        </h2>
        
        {/* 历史沿革 */}
        {data.content?.history && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-3">{data.content.history.title}</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                {data.content.history.content.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-text-secondary mb-4">{paragraph}</p>
                ))}
              </div>
              <div className="md:w-1/3">
                {data.selectedImages[0] && (
                  <img 
                    src={data.selectedImages[0]} 
                    alt={`${data.name}历史`} 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 文化特色 */}
        {data.content?.culture && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-3">{data.content.culture.title}</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {data.selectedImages[1] && (
                  <img 
                    src={data.selectedImages[1]} 
                    alt={`${data.name}文化`} 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="md:w-2/3">
                {data.content.culture.content.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-text-secondary mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* 其他内容... */}
      </div>
    </div>
  );
};

// 通用数据预览组件
const GeneralDataPreview: React.FC<{ data: PreviewData; type: string }> = ({ data, type }) => {
  return (
    <div className={styles.generalPreview}>
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6">{data.name}</h2>
        <p className="text-text-secondary mb-6">{data.description}</p>
        
        {data.selectedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {data.selectedImages.map((imageUrl, index) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`${data.name} 图片 ${index + 1}`} 
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        
        {data.content && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">详细信息</h3>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(data.content, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CozeDataReview;