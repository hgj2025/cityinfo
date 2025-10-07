import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DataCollection.module.css';
import api from '../../../services/api';

interface CollectionTask {
  id: string;
  city: string;
  dataType: string;
  status: string;
  progress: number;
  createdAt: string;
  error?: string;
}

const DataCollection: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    city: '',
    dataTypes: [] as string[]
  });
  const [stats, setStats] = useState({
    totalTasks: 0,
    runningTasks: 0,
    completedTasks: 0,
    failedTasks: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/data-collection/tasks');
      const taskList = data.data?.tasks || [];
      setTasks(taskList);
        
      // 计算统计数据
      const totalTasks = taskList.length;
      const runningTasks = taskList.filter((task: CollectionTask) => task.status === 'running').length;
      const completedTasks = taskList.filter((task: CollectionTask) => task.status === 'completed').length;
      const failedTasks = taskList.filter((task: CollectionTask) => task.status === 'failed').length;
      
      setStats({
        totalTasks,
        runningTasks,
        completedTasks,
        failedTasks
      });
    } catch (error) {
      console.error('获取任务列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.city.trim()) {
      alert('请输入城市名称');
      return;
    }

    if (newTask.dataTypes.length === 0) {
      alert('请至少选择一种数据类型');
      return;
    }

    try {
      // 为每个选中的数据类型创建单独的任务
      const promises = newTask.dataTypes.map(dataType => 
        api.post('/admin/data-collection/start', { 
          cityName: newTask.city, 
          dataType 
        }).then(() => ({ ok: true })).catch(() => ({ ok: false }))
      );

      const responses = await Promise.all(promises);
      
      // 检查是否所有请求都成功
      const failedRequests = responses.filter(response => !response.ok);
      
      if (failedRequests.length === 0) {
        setShowCreateModal(false);
        setNewTask({ city: '', dataTypes: [] });
        fetchTasks();
        alert(`成功创建 ${newTask.dataTypes.length} 个数据采集任务`);
      } else {
        const successCount = responses.length - failedRequests.length;
        if (successCount > 0) {
          alert(`成功创建 ${successCount} 个任务，${failedRequests.length} 个任务创建失败`);
          fetchTasks();
        } else {
          alert('所有任务创建失败');
        }
      }
    } catch (error) {
      console.error('创建任务失败:', error);
      alert('创建任务失败');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/admin/data-collection/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('删除任务失败:', error);
      alert('删除任务失败');
    }
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      await api.post(`/admin/data-collection/tasks/${taskId}/retry`);
      fetchTasks();
    } catch (error) {
      console.error('重试任务失败:', error);
      alert('重试任务失败');
    }
  };



  const getDataTypeText = (dataType: string) => {
    switch (dataType) {
      case 'attraction': return '景点';
      case 'restaurant': return '餐厅';
      case 'hotel': return '酒店';
      default: return dataType;
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      default: return '📍';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: '#faad14', bg: '#fff7e6', text: '等待中' },
      running: { color: '#52c41a', bg: '#f6ffed', text: '运行中' },
      completed: { color: '#13c2c2', bg: '#e6fffb', text: '已完成' },
      failed: { color: '#f5222d', bg: '#fff2f0', text: '失败' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span 
        className={styles.taskStatusBadge}
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.text}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      pending: '⏳',
      running: '🔄',
      completed: '✅',
      failed: '❌'
    };
    return iconMap[status as keyof typeof iconMap] || '⏳';
  };

  // 处理数据类型复选框变化
  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    setNewTask(prev => ({
      ...prev,
      dataTypes: checked 
        ? [...prev.dataTypes, dataType]
        : prev.dataTypes.filter(type => type !== dataType)
    }));
  };

  // 数据类型选项配置
  const dataTypeOptions = [
    { value: 'attractions', label: '景点', icon: '🏛️' },
    { value: 'restaurants', label: '餐厅', icon: '🍽️' },
    { value: 'hotels', label: '酒店', icon: '🏨' }
  ];

  const statCards = [
    {
      title: '总任务数',
      value: stats.totalTasks,
      icon: '📊',
      color: '#1890ff'
    },
    {
      title: '运行中',
      value: stats.runningTasks,
      icon: '⚡',
      color: '#52c41a'
    },
    {
      title: '已完成',
      value: stats.completedTasks,
      icon: '✅',
      color: '#13c2c2'
    },
    {
      title: '失败任务',
      value: stats.failedTasks,
      icon: '❌',
      color: '#f5222d'
    }
  ];

  return (
    <div className={styles.dataCollection}>
      <div className={styles.header}>
        <h2 className={styles.title}>数据采集管理</h2>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          <span className={styles.btnIcon}>➕</span>
          创建采集任务
        </button>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: `${card.color}15` }}>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{card.value}</div>
              <div className={styles.cardTitle}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>创建采集任务</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>城市名称</label>
                <input
                  type="text"
                  value={newTask.city}
                  onChange={(e) => setNewTask(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="请输入城市名称，如：北京、上海"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>数据类型（可多选）</label>
                <div className={styles.checkboxGroup}>
                  {dataTypeOptions.map(option => (
                    <label key={option.value} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={newTask.dataTypes.includes(option.value)}
                        onChange={(e) => handleDataTypeChange(option.value, e.target.checked)}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxLabel}>
                        <span className={styles.checkboxIcon}>{option.icon}</span>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowCreateModal(false)}
              >
                取消
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleCreateTask}
              >
                创建任务
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.taskSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📋</span>
            采集任务列表
          </h3>
          <button 
            className={styles.refreshBtn}
            onClick={fetchTasks}
            disabled={loading}
          >
            <span className={styles.refreshIcon}>🔄</span>
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
        
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <span>加载中...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h4>暂无采集任务</h4>
            <p className={styles.emptyTip}>点击"创建采集任务"开始数据采集</p>
            <button 
              className={styles.emptyActionBtn}
              onClick={() => setShowCreateModal(true)}
            >
              立即创建
            </button>
          </div>
        ) : (
          <div className={styles.taskGrid}>
            {tasks.map(task => (
              <div key={task.id} className={`${styles.taskCard} ${styles[`status-${task.status}`]}`}>
                <div className={styles.taskCardHeader}>
                  <div className={styles.taskMainInfo}>
                    <h4 className={styles.taskCity}>
                      <span className={styles.cityIcon}>🏙️</span>
                      {task.city}
                    </h4>
                    <div className={styles.taskMeta}>
                      <span className={styles.taskType}>
                        {getDataTypeIcon(task.dataType)} {getDataTypeText(task.dataType)}
                      </span>
                      <span className={styles.taskTime}>
                        🕒 {new Date(task.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{getStatusIcon(task.status)}</span>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
                
                {task.status === 'running' && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressInfo}>
                      <span>进度</span>
                      <span className={styles.progressPercent}>{Math.round(task.progress)}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {task.error && (
                  <div className={styles.errorSection}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <span className={styles.errorText}>{task.error}</span>
                  </div>
                )}
                
                <div className={styles.taskActions}>
                  {task.status === 'running' && (
                    <div className={styles.runningIndicator}>
                      <div className={styles.pulse}></div>
                      <span>任务运行中...</span>
                    </div>
                  )}
                  
                  <button 
                    className={styles.detailsBtn}
                    onClick={() => navigate(`/p-admin/tasks/${task.id}/details`)}
                  >
                    <span className={styles.btnIcon}>📋</span>
                    查看详情
                  </button>
                  
                  {(task.status === 'failed' || task.status === 'completed') && (
                    <button 
                      className={styles.retryBtn}
                      onClick={() => handleRetryTask(task.id)}
                    >
                      <span className={styles.btnIcon}>🔄</span>
                      重试
                    </button>
                  )}
                  
                  {task.status !== 'running' && (
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <span className={styles.btnIcon}>🗑️</span>
                      删除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollection;