import React, { useState, useEffect } from 'react';
import styles from './VisualReviewInterface.module.css';
import api from '../../../services/api';

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
  source: 'dataReview' | 'collectionTask';
}

interface ImageGroup {
  title: string;
  images: string[];
}

interface SelectedImage {
  url: string;
  group: string;
  selected: boolean;
}

const VisualReviewInterface: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [selectedPictures, setSelectedPictures] = useState<{[adviseIndex: number]: number[]}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFilter, setImageFilter] = useState<'all' | 'selected' | 'unselected'>('all');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const pageSize = 10;

  const dataTypeLabels: Record<string, string> = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店',
    city_overview: '城市概览',
    general: '通用数据'
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        status: 'pending'
      });
      
      // 获取数据审核数据源
      const [dataReviewRes, collectionTaskRes] = await Promise.all([
        api.get(`/admin/reviews?${params}`),
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
          });
        });
      }

      // 处理 CollectionTask 数据
      collectionTaskRes.forEach((review: ReviewData) => {
        allReviews.push(review);
      });

      // 按时间排序
      allReviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      setReviews(allReviews);
      setTotalPages(Math.ceil(allReviews.length / pageSize));
    } catch (error) {
      console.error('获取审核数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionTaskReviews = async (params: URLSearchParams) => {
    try {
      const tasksData = await api.get(`/admin/data-collection/tasks?${params}`);
      
      if (tasksData.status !== 'success' || !tasksData.data?.tasks) return [];
      
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

  // 提取图片数据
  const extractImages = (data: any): ImageGroup[] => {
    if (!data || typeof data !== 'object') return [];
    
    const groups: ImageGroup[] = [];
    
    // 检查常见的图片字段
    const imageFields = ['images', 'pictures', 'pictureAdvises', 'image'];
    
    imageFields.forEach(fieldName => {
      if (data[fieldName]) {
        let images: string[] = [];
        
        if (Array.isArray(data[fieldName])) {
          images = data[fieldName].filter((item: any) => {
            if (typeof item === 'string') {
              return isValidImageUrl(item);
            }
            return false;
          });
        } else if (typeof data[fieldName] === 'string' && isValidImageUrl(data[fieldName])) {
          images = [data[fieldName]];
        }
        
        if (images.length > 0) {
          const title = fieldName === 'images' ? '主要图片' : 
                       fieldName === 'pictures' ? '相关图片' : 
                       fieldName === 'pictureAdvises' ? '推荐图片' :
                       fieldName === 'image' ? '封面图片' : fieldName;
          groups.push({ title, images });
        }
      }
    });

    // 递归查找其他可能的图片字段
    const findImages = (obj: any, path: string = '') => {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'string' && isValidImageUrl(item)) {
            const title = path || `其他图片 ${groups.length + 1}`;
            let group = groups.find(g => g.title === title);
            if (!group) {
              group = { title, images: [] };
              groups.push(group);
            }
            if (!group.images.includes(item)) {
              group.images.push(item);
            }
          } else if (typeof item === 'object' && item !== null) {
            findImages(item, path || `项目 ${index + 1}`);
          }
        });
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          // 跳过已经处理过的字段
          if (imageFields.includes(key)) return;
          
          if (typeof value === 'string' && isValidImageUrl(value)) {
            const title = path ? `${path} - ${key}` : key;
            let group = groups.find(g => g.title === title);
            if (!group) {
              group = { title, images: [] };
              groups.push(group);
            }
            if (!group.images.includes(value)) {
              group.images.push(value);
            }
          } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            findImages(value, path ? `${path} - ${key}` : key);
          }
        });
      }
    };

    // 只对非标准字段进行递归搜索
    const remainingData = { ...data };
    imageFields.forEach(field => delete remainingData[field]);
    findImages(remainingData);
    
    return groups;
  };

  const isValidImageUrl = (url: string): boolean => {
    return url.includes('http') || url.includes('data:image') || 
           url.includes('.jpg') || url.includes('.png') || 
           url.includes('.jpeg') || url.includes('.gif') || 
           url.includes('.webp');
  };

  // 提取文本信息
  const extractTextInfo = (data: any) => {
    if (!data || typeof data !== 'object') {
      return {};
    }
    
    const textInfo: Record<string, any> = {};
    const imageFields = ['images', 'pictures', 'image'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'string' && !isValidImageUrl(value)) {
          textInfo[key] = value;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          textInfo[key] = value;
        } else if (Array.isArray(value)) {
          // 对于数组，区分图片数组和文本数组
          if (key === 'pictureAdvises' || key.toLowerCase().includes('advise')) {
            // 图片建议数组，显示数量和前几项
            textInfo[key] = value;
            textInfo[`${key}_count`] = value.length;
            textInfo[`${key}_preview`] = value.slice(0, 3).join('; ') + (value.length > 3 ? '...' : '');
          } else if (value.every(item => typeof item === 'string' && !isValidImageUrl(item))) {
            textInfo[key] = value;
          }
        } else if (typeof value === 'object' && !imageFields.includes(key)) {
          // 递归处理嵌套对象
          if (key === 'tradition' && value) {
            // 特殊处理tradition对象
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subKey !== 'pictureAdvise' && subValue) {
                textInfo[`${key}.${subKey}`] = subValue;
              }
            });
          } else {
            // 一般嵌套对象处理
            const nestedInfo = extractTextInfo(value);
            Object.entries(nestedInfo).forEach(([nestedKey, nestedValue]) => {
              textInfo[`${key}.${nestedKey}`] = nestedValue;
            });
          }
        }
      }
    });
    
    return textInfo;
  };

  const handleSelectReview = (review: ReviewData) => {
    // 验证数据完整性
    if (!review) {
      console.error('审核项目为空');
      return;
    }
    
    if (!review.data) {
      console.error('审核数据不完整，data字段为空:', review);
      // 即使data为空，也要设置selectedReview以显示错误信息
      setSelectedReview(review);
      return;
    }
    
    setSelectedReview(review);
    setSelectedPictures({}); // 重置选择状态
    
    // 初始化图片选择状态
    const imageGroups = extractImages(review.data);
    const allImages: SelectedImage[] = [];
    imageGroups.forEach(group => {
      group.images.forEach(url => {
        allImages.push({
          url,
          group: group.title,
          selected: false
        });
      });
    });
    setSelectedImages(allImages);
  };

  const handleImageToggle = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.map(img => 
        img.url === imageUrl 
          ? { ...img, selected: !img.selected }
          : img
      )
    );
  };

  const handleSelectAll = () => {
    setSelectedImages(prev => 
      prev.map(img => ({ ...img, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setSelectedImages(prev => 
      prev.map(img => ({ ...img, selected: false }))
    );
  };

  const getFilteredImages = () => {
    switch (imageFilter) {
      case 'selected':
        return selectedImages.filter(img => img.selected);
      case 'unselected':
        return selectedImages.filter(img => !img.selected);
      default:
        return selectedImages;
    }
  };

  const handlePictureToggle = (adviseIndex: number, pictureIndex: number) => {
    setSelectedPictures(prev => {
      const currentSelected = prev[adviseIndex] || [];
      const isSelected = currentSelected.includes(pictureIndex);
      
      if (isSelected) {
        // 取消选择
        return {
          ...prev,
          [adviseIndex]: currentSelected.filter(idx => idx !== pictureIndex)
        };
      } else {
        // 添加选择
        return {
          ...prev,
          [adviseIndex]: [...currentSelected, pictureIndex]
        };
      }
    });
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>数据审核 - 图文并茂模式</h1>
        <div className={styles.stats}>
          <span>待审核: {reviews.length} 条</span>
        </div>
      </div>

      <div className={styles.content}>
        {/* 左侧列表 */}
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
                onClick={() => handleSelectReview(review)}
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
          
          {reviews.length === 0 && (
            <div className={styles.empty}>暂无待审核数据</div>
          )}
        </div>

        {/* 右侧详情 */}
        <div className={styles.reviewDetail}>
          {selectedReview ? (
            <>
              <div className={styles.detailHeader}>
                <h2>审核详情</h2>
                <div className={styles.detailMeta}>
                  <span>{dataTypeLabels[selectedReview.dataType] || selectedReview.dataType}</span>
                  <span>{formatDate(selectedReview.submittedAt)}</span>
                </div>
              </div>

              <div className={styles.detailContent}>
                {/* 数据验证和错误处理 */}
                {!selectedReview.data ? (
                  <div className={styles.errorMessage}>
                    <h3>数据错误</h3>
                    <p>该审核项目的数据为空或格式不正确</p>
                  </div>
                ) : (
                  <div>
                    {/* 文本信息 */}
                    <div className={styles.textSection}>
                      <h3>基本信息</h3>
                      <div className={styles.textInfo}>
                        {Object.entries(extractTextInfo(selectedReview.data)).map(([key, value]) => {
                          // 跳过内部生成的字段
                          if (key.endsWith('_count') || key.endsWith('_preview')) return null;
                          
                          // 友好的字段名映射
                          const fieldLabels: Record<string, string> = {
                            'city': '城市',
                            'location': '位置',
                            'name': '名称',
                            'title': '标题',
                            'description': '描述',
                            'pictureAdvises': '图片建议',
                            'type': '类型',
                            'category': '分类',
                            'address': '地址',
                            'phone': '电话',
                            'website': '网站',
                            'rating': '评分',
                            'price': '价格',
                            'openTime': '开放时间',
                            'tags': '标签',
                            'culture': '文化',
                            'history': '历史',
                            'art': '艺术',
                            'hero': '英雄人物',
                            'activity': '活动',
                            'tradition.food': '传统美食',
                            'tradition.daily': '日常生活',
                            'tradition.bigday': '重要节日',
                            'tradition.tradition': '传统习俗'
                          };
                          
                          const label = fieldLabels[key] || key;
                          
                          return (
                            <div key={key} className={styles.textItem}>
                              <label>{label}:</label>
                              <span>
                                {Array.isArray(value) ? (
                                  key === 'pictureAdvises' ? (
                                    <div>
                                      <div>共 {value.length} 项建议</div>
                                      <div className={styles.advisesList}>
                                        {value.map((item: string, index: number) => {
                                          // 获取对应的图片（每个建议对应3张图片）
                                          const pictures = selectedReview?.data?.pictures || [];
                                          const relatedPictures = pictures.slice(index * 3, (index + 1) * 3);
                                          
                                          return (
                                            <div key={index} className={styles.adviseItemWithImages}>
                                              <div className={styles.adviseText}>
                                                {index + 1}. {item}
                                              </div>
                                              {relatedPictures.length > 0 && (
                                                <div className={styles.relatedImages}>
                                                  {relatedPictures.map((picture: any, picIndex: number) => {
                                                    const isSelected = (selectedPictures[index] || []).includes(picIndex);
                                                    return (
                                                      <div 
                                                        key={picIndex} 
                                                        className={`${styles.relatedImageItem} ${isSelected ? styles.selected : ''}`}
                                                        onClick={() => handlePictureToggle(index, picIndex)}
                                                      >
                                                        <div className={styles.imageContainer}>
                                                          <img 
                                                            src={picture.display_url} 
                                                            alt={picture.title}
                                                            className={styles.relatedImage}
                                                            onError={(e) => {
                                                              const target = e.target as HTMLImageElement;
                                                              target.style.display = 'none';
                                                            }}
                                                          />
                                                          <div className={styles.imageCheckbox}>
                                                            <input 
                                                              type="checkbox" 
                                                              checked={isSelected}
                                                              onChange={() => handlePictureToggle(index, picIndex)}
                                                              onClick={(e) => e.stopPropagation()}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className={styles.imageTitle}>{picture.title}</div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ) : (
                                    value.join(', ')
                                  )
                                ) : (
                                  String(value)
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 图片展示 */}
                    <div className={styles.imageSection}>
                      <div className={styles.imageSectionHeader}>
                        <h3>图片内容</h3>
                        <div className={styles.imageControls}>
                          <div className={styles.imageFilters}>
                            <button 
                              className={imageFilter === 'all' ? styles.active : ''}
                              onClick={() => setImageFilter('all')}
                            >
                              全部 ({selectedImages.length})
                            </button>
                            <button 
                              className={imageFilter === 'selected' ? styles.active : ''}
                              onClick={() => setImageFilter('selected')}
                            >
                              已选 ({selectedImages.filter(img => img.selected).length})
                            </button>
                            <button 
                              className={imageFilter === 'unselected' ? styles.active : ''}
                              onClick={() => setImageFilter('unselected')}
                            >
                              未选 ({selectedImages.filter(img => !img.selected).length})
                            </button>
                          </div>
                          <div className={styles.batchActions}>
                            <button onClick={handleSelectAll} className={styles.batchButton}>
                              全选
                            </button>
                            <button onClick={handleDeselectAll} className={styles.batchButton}>
                              全不选
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className={styles.imageGrid}>
                        {getFilteredImages().map((image, index) => (
                          <div 
                            key={index} 
                            className={`${styles.imageItem} ${image.selected ? styles.selectedImage : ''}`}
                            onClick={() => handleImageToggle(image.url)}
                          >
                            <img 
                              src={image.url} 
                              alt={`图片 ${index + 1}`}
                              className={styles.reviewImage}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.png';
                              }}
                            />
                            <div className={styles.imageOverlay}>
                              <div className={styles.imageGroup}>{image.group}</div>
                              <div className={styles.selectIndicator}>
                                {image.selected ? '✓' : '○'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <h2>请选择要审核的数据</h2>
              <p>从左侧列表中选择一条数据开始审核</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualReviewInterface;