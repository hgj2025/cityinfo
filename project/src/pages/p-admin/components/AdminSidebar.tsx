import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      label: '仪表板',
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      key: 'data-collection',
      label: '数据采集',
      icon: '🔍',
      path: '/admin/data-collection'
    },
    {
      key: 'city-management',
      label: '城市管理',
      icon: '🏙️',
      path: '/admin/cities'
    },
    {
      key: 'attraction-management',
      label: '景点管理',
      icon: '🎯',
      path: '/admin/attractions'
    },
    {
      key: 'food-management',
      label: '美食管理',
      icon: '🍜',
      path: '/admin/foods'
    },
    {
      key: 'review-queue',
      label: '数据审核',
      icon: '✅',
      path: '/admin/reviews'
    }
  ];

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          {!collapsed && <span>城市信息管理</span>}
          {collapsed && <span>城</span>}
        </div>
        <button className={styles.toggleBtn} onClick={onToggle}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!collapsed && <span className={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;