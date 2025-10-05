import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';

interface DashboardStats {
  totalCities: number;
  totalAttractions: number;
  totalFoods: number;
  pendingReviews: number;
  todayCollections: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCities: 0,
    totalAttractions: 0,
    totalFoods: 0,
    pendingReviews: 0,
    todayCollections: 0
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // 模拟数据加载
    setStats({
      totalCities: 156,
      totalAttractions: 1234,
      totalFoods: 2567,
      pendingReviews: 23,
      todayCollections: 8
    });

    setRecentActivities([
      { id: 1, type: 'collection', message: '采集了北京的景点数据', time: '10分钟前' },
      { id: 2, type: 'review', message: '审核通过了上海美食数据', time: '30分钟前' },
      { id: 3, type: 'collection', message: '采集了广州的酒店数据', time: '1小时前' },
      { id: 4, type: 'review', message: '审核通过了深圳景点数据', time: '2小时前' }
    ]);
  }, []);

  const statCards = [
    {
      title: '城市总数',
      value: stats.totalCities,
      icon: '🏙️',
      color: '#1890ff'
    },
    {
      title: '景点总数',
      value: stats.totalAttractions,
      icon: '🎯',
      color: '#52c41a'
    },
    {
      title: '美食总数',
      value: stats.totalFoods,
      icon: '🍜',
      color: '#fa8c16'
    },
    {
      title: '待审核',
      value: stats.pendingReviews,
      icon: '⏳',
      color: '#f5222d'
    },
    {
      title: '今日采集',
      value: stats.todayCollections,
      icon: '📊',
      color: '#722ed1'
    }
  ];

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>数据概览</h2>
      
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.cardIcon} style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{card.value}</div>
              <div className={styles.cardTitle}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.activitySection}>
        <h3 className={styles.sectionTitle}>最近活动</h3>
        <div className={styles.activityList}>
          {recentActivities.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                {activity.type === 'collection' ? '🔍' : '✅'}
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityMessage}>{activity.message}</div>
                <div className={styles.activityTime}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>快速操作</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionBtn} onClick={() => window.location.href = '/admin/data-collection'}>
            🔍 开始数据采集
          </button>
          <button className={styles.actionBtn} onClick={() => window.location.href = '/admin/review'}>
            ✅ 查看待审核
          </button>
          <button className={styles.actionBtn} onClick={() => window.location.href = '/admin/cities'}>
            🏙️ 管理城市
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;