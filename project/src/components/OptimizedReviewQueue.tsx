import React, { useState, useEffect } from 'react';
import styles from './OptimizedReviewQueue.module.css';
import api from '../services/api';

// 类型定义
interface CollectionTask {
  id: string;
  city: string;
  dataType: string;
  status: string;
  createdAt: string;
  data?: any;
}

interface ReviewData {
  id: string;
  taskId: string;
  dataType: string;
  data: any;
  status: string;
  createdAt: string;
  task?: CollectionTask;
}

interface CozeReviewData {
  id: string;
  taskId: string;
  dataType: string;
  data: any;
  status: string;
  createdAt: string;
  task?: CollectionTask;
}

interface CityReviewSummary {
  city: string;
  taskId: string;
  pendingCount: number;
  completedCount: number;
  totalCount: number;
  lastUpdated: string;
  dataTypes: string[];
}

interface ImageGroup {
  title: string;
  images: string[];
}

const OptimizedReviewQueue: React.FC = () => {
  // 状态管理
  const [cityList, setCityList] = useState<CityReviewSummary[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'restaurants' | 'hotels'>('overview');
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [cozeData, setCozeData] = useState<CozeReviewData[]>([]);
  const [collectionTasks, setCollectionTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // 获取城市列表数据
  useEffect(() => {
    fetchCityList();
  }, []);

  // 当选中城市变化时，获取详情数据
  useEffect(() => {
    if (selectedTaskId) {
      fetchCityDetails(selectedTaskId);
    }
  }, [selectedTaskId]);

  const fetchCityList = async () => {
    try {
      setLoading(true);
      
      // 并行获取所有数据源
      const [reviewsData, cozeData, tasksData] = await Promise.all([
        api.get('/admin/reviews?page=1&limit=100'),
        api.get('/admin/coze-reviews?page=1&limit=100'),
        api.get('/admin/data-collection/tasks')
      ]);


      // 按城市聚合数据
      const cityMap = new Map<string, CityReviewSummary>();

      // 处理采集任务
      tasksData.data?.forEach((task: CollectionTask) => {
        if (!cityMap.has(task.city)) {
          cityMap.set(task.city, {
            city: task.city,
            taskId: task.id,
            pendingCount: 0,
            completedCount: 0,
            totalCount: 0,
            lastUpdated: task.createdAt,
            dataTypes: []
          });
        }
      });

      // 处理审核数据
      reviewsData.data?.reviews?.forEach((review: ReviewData) => {
        const task = tasksData.data?.find((t: CollectionTask) => t.id === review.taskId);
        if (task) {
          const summary = cityMap.get(task.city);
          if (summary) {
            summary.totalCount++;
            if (review.status === 'pending') {
              summary.pendingCount++;
            } else {
              summary.completedCount++;
            }
            if (!summary.dataTypes.includes(review.dataType)) {
              summary.dataTypes.push(review.dataType);
            }
          }
        }
      });

      // 处理Coze数据
      cozeData.data?.reviews?.forEach((review: CozeReviewData) => {
        const task = tasksData.data?.find((t: CollectionTask) => t.id === review.taskId);
        if (task) {
          const summary = cityMap.get(task.city);
          if (summary) {
            summary.totalCount++;
            if (review.status === 'pending') {
              summary.pendingCount++;
            } else {
              summary.completedCount++;
            }
            if (!summary.dataTypes.includes(review.dataType)) {
              summary.dataTypes.push(review.dataType);
            }
          }
        }
      });

      const cities = Array.from(cityMap.values()).sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );

      setCityList(cities);
      
      // 默认选中第一个城市
      if (cities.length > 0 && !selectedCity) {
        setSelectedCity(cities[0].city);
        setSelectedTaskId(cities[0].taskId);
      }
    } catch (error) {
      console.error('获取城市列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCityDetails = async (taskId: string) => {
    try {
      setDetailLoading(true);
      
      const [reviewsData, cozeData] = await Promise.all([
        api.get(`/admin/reviews?taskId=${taskId}&page=1&limit=100`),
        api.get(`/admin/coze-reviews?taskId=${taskId}&page=1&limit=100`)
      ]);

      setReviewData(reviewsData.data?.reviews || []);
      setCozeData(cozeData.data?.reviews || []);
    } catch (error) {
      console.error('获取城市详情失败:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  // 处理城市选择
  const handleCitySelect = (city: string, taskId: string) => {
    setSelectedCity(city);
    setSelectedTaskId(taskId);
    setActiveTab('overview');
  };

  // 获取当前tab的数据
  const getCurrentTabData = () => {
    const allData = [...reviewData, ...cozeData];
    return allData.filter(item => {
      switch (activeTab) {
        case 'overview':
          return item.dataType === 'general' || item.dataType === 'overview';
        case 'attractions':
          return item.dataType === 'attractions';
        case 'restaurants':
          return item.dataType === 'restaurants';
        case 'hotels':
          return item.dataType === 'hotels';
        default:
          return false;
      }
    });
  };

  // 图片聚合处理
  const groupImagesByTitle = (data: any): ImageGroup[] => {
    if (!data || typeof data !== 'object') return [];
    
    const groups: ImageGroup[] = [];
    
    // 检查常见的图片字段
    const imageFields = ['images', 'pictures', 'pictureAdvises'];
    
    imageFields.forEach(fieldName => {
      if (data[fieldName] && Array.isArray(data[fieldName])) {
        const images = data[fieldName].filter((item: any) => {
          if (typeof item === 'string') {
            return item.includes('http') || item.includes('data:image') || item.includes('.jpg') || item.includes('.png') || item.includes('.jpeg');
          }
          return false;
        });
        
        if (images.length > 0) {
          const title = fieldName === 'images' ? '主要图片' : 
                       fieldName === 'pictures' ? '相关图片' : 
                       fieldName === 'pictureAdvises' ? '推荐图片' : fieldName;
          groups.push({ title, images });
        }
      }
    });
    
    // 递归查找其他可能的图片字段
    const findImages = (obj: any, path: string = '') => {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'string' && (item.includes('http') || item.includes('data:image') || item.includes('.jpg') || item.includes('.png') || item.includes('.jpeg'))) {
            // 这是图片URL
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
          
          if (typeof value === 'string' && (value.includes('http') || value.includes('data:image') || value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg'))) {
            // 这是图片URL
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

  // 审核操作
  const handleReview = async (itemId: string, action: 'approve' | 'reject', dataType: string, notes?: string) => {
    try {
      let result;
      
      if (dataType === 'coze') {
        result = await api.put(`/admin/coze-reviews/${itemId}`, {
          action,
          notes: notes || '',
          selectedImages: []
        });
      } else if (dataType === 'data_review') {
        result = await api.post(`/admin/reviews/${itemId}`, {
          action,
          notes: notes || '',
          selectedImages: []
        });
      } else {
        // 对于采集任务数据，暂时提示功能开发中
        alert('采集任务数据审核功能正在开发中');
        return;
      }
      
      if (result.status === 'success') {
        // 刷新数据
        if (selectedTaskId) {
          await fetchCityDetails(selectedTaskId);
        }
        await fetchCityList();
        alert(`数据已${action === 'approve' ? '通过' : '拒绝'}审核`);
      } else {
        alert('审核失败: ' + result.message);
      }
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败');
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('确定要删除这个待审核任务吗？此操作不可撤销！')) {
      return;
    }
    
    try {
      const result = await api.delete(`/admin/data-collection/tasks/${taskId}`);
      
      if (result.status === 'success') {
        // 刷新城市列表
        await fetchCityList();
        // 如果删除的是当前选中的任务，清空选择
        if (selectedTaskId === taskId) {
          setSelectedTaskId(null);
          setSelectedCity(null);
          setReviewData([]);
          setCozeData([]);
          setCollectionTasks([]);
        }
        alert('任务删除成功');
      } else {
        alert('删除失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      alert('删除任务失败');
    }
  };



  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 左侧城市列表 */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>待审核城市</h2>
          <span className={styles.cityCount}>{cityList.length} 个城市</span>
        </div>
        
        <div className={styles.cityList}>
          {cityList.map((city) => (
            <div
              key={city.taskId}
              className={`${styles.cityItem} ${selectedCity === city.city ? styles.active : ''}`}
              onClick={() => handleCitySelect(city.city, city.taskId)}
            >
              <div className={styles.cityName}>{city.city}</div>
              <div className={styles.cityStats}>
                <span className={styles.pending}>待审核: {city.pendingCount}</span>
                <span className={styles.completed}>已完成: {city.completedCount}</span>
              </div>
              <div className={styles.dataTypes}>
                {city.dataTypes.map(type => (
                  <span key={type} className={styles.typeTag}>{type}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧详情区域 */}
      <div className={styles.mainContent}>
        {selectedCity ? (
          <>
            {/* 城市头部 */}
            <div className={styles.cityHeader}>
              <h1>{selectedCity} 数据审核</h1>
              <div className={styles.headerActions}>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    if (selectedTaskId) {
                      handleDeleteTask(selectedTaskId);
                    }
                  }}
                >
                  <i className="fas fa-trash"></i>
                  删除任务
                </button>
              </div>
            </div>

            {/* TAB导航 */}
            <div className={styles.tabNavigation}>
              <button
                className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-info-circle"></i>
                城市概览
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'attractions' ? styles.active : ''}`}
                onClick={() => setActiveTab('attractions')}
              >
                <i className="fas fa-landmark"></i>
                景点
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'restaurants' ? styles.active : ''}`}
                onClick={() => setActiveTab('restaurants')}
              >
                <i className="fas fa-utensils"></i>
                餐厅
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'hotels' ? styles.active : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                <i className="fas fa-bed"></i>
                酒店
              </button>
            </div>

            {/* TAB内容 */}
            <div className={styles.tabContent}>
              {detailLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>加载详情中...</p>
                </div>
              ) : (
                <div className={styles.reviewItems}>
                  {getCurrentTabData().map((item) => {
                    const imageGroups = groupImagesByTitle(item.data);
                    
                    return (
                      <div key={item.id} className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewMeta}>
                            <span className={styles.dataType}>{item.dataType}</span>
                            <span className={`${styles.status} ${styles[item.status]}`}>
                              {item.status === 'pending' ? '待审核' : '已审核'}
                            </span>
                          </div>
                          <div className={styles.reviewDate}>
                            {new Date(item.createdAt).toLocaleString()}
                          </div>
                        </div>

                        {/* 数据预览 */}
                        <div className={styles.dataPreview}>
                          <pre>{JSON.stringify(item.data, null, 2)}</pre>
                        </div>

                        {/* 图片聚合展示 */}
                        {imageGroups.length > 0 && (
                          <div className={styles.imageGroups}>
                            <h4>图片预览</h4>
                            {imageGroups.map((group, index) => (
                              <div key={index} className={styles.imageGroup}>
                                <h5>{group.title}</h5>
                                <div className={styles.imageGrid}>
                                  {group.images.map((image, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      src={image}
                                      alt={`${group.title} ${imgIndex + 1}`}
                                      className={styles.previewImage}
                                      onClick={() => window.open(image, '_blank')}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 操作按钮 */}
                        {item.status === 'pending' && (
                          <div className={styles.reviewActions}>
                            <button
                              className={styles.approveButton}
                              onClick={() => {
                                const dataType = reviewData.find(r => r.id === item.id) ? 'data_review' : 'coze';
                                handleReview(item.id, 'approve', dataType);
                              }}
                            >
                              <i className="fas fa-check"></i>
                              通过
                            </button>
                            <button
                              className={styles.rejectButton}
                              onClick={() => {
                                const dataType = reviewData.find(r => r.id === item.id) ? 'data_review' : 'coze';
                                handleReview(item.id, 'reject', dataType);
                              }}
                            >
                              <i className="fas fa-times"></i>
                              拒绝
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {getCurrentTabData().length === 0 && (
                    <div className={styles.emptyState}>
                      <i className="fas fa-inbox"></i>
                      <p>暂无{activeTab}数据</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <i className="fas fa-city"></i>
            <p>请选择一个城市查看详情</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedReviewQueue;