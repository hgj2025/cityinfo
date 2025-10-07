import React, { useState, useEffect } from 'react';
import styles from './DataReview.module.css';
import api from '../../../services/api';

interface DataReview {
  id: string;
  taskId: string;
  data: any;
  status: string;
  reviewedAt?: string;
  createdAt: string;
}

interface CollectionTask {
  id: string;
  city: string;
  dataType: string;
}

const DataReview: React.FC = () => {
  const [reviews, setReviews] = useState<DataReview[]>([]);
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<DataReview | null>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchTasks();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/reviews?status=pending');
      setReviews(data.data?.reviews || []);
    } catch (error) {
      console.error('获取待审核数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await api.get('/admin/data-collection/tasks');
      setTasks(data.data?.tasks || []);
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  };

  const handleReview = (review: DataReview) => {
    setSelectedReview(review);
    setEditedData(JSON.parse(JSON.stringify(review.data)));
    setShowModal(true);
  };

  const handleApprove = async (reviewId: string, editedData?: any) => {
    try {
      await api.post(`/admin/reviews/${reviewId}`, {
        action: 'approve',
        editedData
      });

      fetchReviews();
      setShowModal(false);
      setSelectedReview(null);
      setEditedData(null);
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await api.post(`/admin/reviews/${reviewId}`, {
        action: 'reject'
      });

      fetchReviews();
      setShowModal(false);
        setSelectedReview(null);
        setEditedData(null);
      } else {
        const error = await response.json();
        alert(error.message || '拒绝失败');
      }
    } catch (error) {
      console.error('拒绝失败:', error);
      alert('拒绝失败');
    }
  };

  const getTaskInfo = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? `${task.city} - ${getDataTypeText(task.dataType)}` : taskId;
  };

  const getDataTypeText = (dataType: string) => {
    switch (dataType) {
      case 'attraction': return '景点';
      case 'restaurant': return '餐厅';
      case 'hotel': return '酒店';
      default: return dataType;
    }
  };

  const renderDataPreview = (data: any) => {
    if (!data) return '无数据';
    
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return data;
      }
    }

    if (data.name) {
      return (
        <div className={styles.dataPreview}>
          <div className={styles.dataTitle}>{data.name}</div>
          {data.address && <div className={styles.dataDetail}>地址: {data.address}</div>}
          {data.rating && <div className={styles.dataDetail}>评分: {data.rating}</div>}
          {data.description && (
            <div className={styles.dataDetail}>
              描述: {data.description.length > 100 
                ? data.description.substring(0, 100) + '...' 
                : data.description
              }
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={styles.dataPreview}>
        <pre>{JSON.stringify(data, null, 2).substring(0, 200)}...</pre>
      </div>
    );
  };

  const handleDataEdit = (field: string, value: any) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>数据审核</h1>
          <p>审核和管理采集到的数据</p>
        </div>
        <button 
          className={styles.refreshButton}
          onClick={fetchReviews}
        >
          刷新
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <div className={styles.emptyText}>暂无待审核数据</div>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewTitle}>
                    {getTaskInfo(review.taskId)}
                  </div>
                  <div className={styles.reviewMeta}>
                    <span>ID: {review.id}</span>
                    <span>创建时间: {new Date(review.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className={styles.reviewContent}>
                  {renderDataPreview(review.data)}
                </div>
                
                <div className={styles.reviewActions}>
                  <button 
                    className={styles.reviewButton}
                    onClick={() => handleReview(review)}
                  >
                    详细审核
                  </button>
                  <button 
                    className={styles.approveButton}
                    onClick={() => handleApprove(review.id)}
                  >
                    快速通过
                  </button>
                  <button 
                    className={styles.rejectButton}
                    onClick={() => handleReject(review.id)}
                  >
                    拒绝
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 详细审核模态框 */}
      {showModal && selectedReview && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>数据审核 - {getTaskInfo(selectedReview.taskId)}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {editedData && typeof editedData === 'object' && (
                <div className={styles.editForm}>
                  {Object.keys(editedData).map(key => (
                    <div key={key} className={styles.formGroup}>
                      <label>{key}</label>
                      {typeof editedData[key] === 'string' && editedData[key].length > 100 ? (
                        <textarea
                          value={editedData[key]}
                          onChange={(e) => handleDataEdit(key, e.target.value)}
                          className={styles.textarea}
                          rows={4}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editedData[key] || ''}
                          onChange={(e) => handleDataEdit(key, e.target.value)}
                          className={styles.input}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                取消
              </button>
              <button 
                className={styles.rejectButton}
                onClick={() => handleReject(selectedReview.id)}
              >
                拒绝
              </button>
              <button 
                className={styles.confirmButton}
                onClick={() => handleApprove(selectedReview.id, editedData)}
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataReview;