
import { useState } from 'react';
import styles from '../../styles.module.css';

interface SidebarProps {
  cityName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ cityName }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // 滚动到对应的部分
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside id="sidebar" className="w-full md:w-64 md:mr-8 mb-6 md:mb-0">
      <div className="bg-white rounded-xl shadow-card p-4 sticky top-24">
        <h2 id="city-name-sidebar" className="text-xl font-bold text-primary mb-4 border-b border-gray-200 pb-2">{cityName}</h2>
        <nav className="space-y-1">
          <a 
            href="#overview" 
            id="nav-overview" 
            className={`${styles['sidebar-link']} ${activeSection === 'overview' ? styles.active : ''} block px-4 py-2 rounded-lg text-text-primary`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('overview');
            }}
          >
            <i className="fas fa-info-circle mr-2"></i>城市概览
          </a>
          <a 
            href="#attractions" 
            id="nav-attractions" 
            className={`${styles['sidebar-link']} ${activeSection === 'attractions' ? styles.active : ''} block px-4 py-2 rounded-lg text-text-secondary`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('attractions');
            }}
          >
            <i className="fas fa-landmark mr-2"></i>景点
          </a>
          <a 
            href="#food" 
            id="nav-food" 
            className={`${styles['sidebar-link']} ${activeSection === 'food' ? styles.active : ''} block px-4 py-2 rounded-lg text-text-secondary`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('food');
            }}
          >
            <i className="fas fa-utensils mr-2"></i>美食
          </a>
          <a 
            href="#accommodation" 
            id="nav-accommodation" 
            className={`${styles['sidebar-link']} ${activeSection === 'accommodation' ? styles.active : ''} block px-4 py-2 rounded-lg text-text-secondary`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('accommodation');
            }}
          >
            <i className="fas fa-bed mr-2"></i>住宿
          </a>
          <a 
            href="#traffic" 
            id="nav-traffic" 
            className={`${styles['sidebar-link']} ${activeSection === 'traffic' ? styles.active : ''} block px-4 py-2 rounded-lg text-text-secondary`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('traffic');
            }}
          >
            <i className="fas fa-bus mr-2"></i>交通
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;