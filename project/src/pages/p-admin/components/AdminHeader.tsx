import React from 'react';
import styles from './AdminHeader.module.css';

const AdminHeader: React.FC = () => {
  const currentTime = new Date().toLocaleString('zh-CN');

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>数据管理后台</h1>
      </div>
      
      <div className={styles.right}>
        <div className={styles.time}>
          {currentTime}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.avatar}>👤</span>
          <span className={styles.username}>管理员</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;