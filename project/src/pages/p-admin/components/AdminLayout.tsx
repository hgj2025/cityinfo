import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';

interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: string;
}

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: '仪表盘',
      path: '/admin',
      icon: '📊'
    },
    {
      key: 'collection',
      label: '数据采集',
      path: '/admin/collection',
      icon: '🔄'
    },
    {
      key: 'review',
      label: '审核队列',
      path: '/admin/review',
      icon: '✅'
    }
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (confirm('确定要退出管理后台吗？')) {
      // 清除认证信息
      localStorage.removeItem('adminToken');
      // 跳转到登录页面或首页
      navigate('/');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.layout}>
      {/* 侧边栏 */}
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏛️</span>
          {!collapsed && <span className={styles.logoText}>城市信息管理</span>}
        </div>
        
        <nav className={styles.menu}>
          {menuItems.map(item => (
            <div
              key={item.key}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </div>
          ))}
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.collapseButton} onClick={() => setCollapsed(!collapsed)}>
            <span>{collapsed ? '→' : '←'}</span>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className={styles.main}>
        {/* 顶部导航栏 */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.pageTitle}>
              {menuItems.find(item => isActive(item.path))?.label || '管理后台'}
            </h2>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>管理员</span>
              <div className={styles.userMenu}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* 页面内容 */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;