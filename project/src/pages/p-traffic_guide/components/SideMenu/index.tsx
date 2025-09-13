
import { Link } from 'react-router-dom';
import { CityId, CityName, SideMenuItem } from '../../types';

interface SideMenuProps {
  cityId: CityId;
  cityName: CityName;
  onShareClick: () => void;
  onCollectClick: () => void;
}

const SideMenu = ({ cityId, cityName, onShareClick, onCollectClick }: SideMenuProps) => {
  // 侧边栏菜单项
  const menuItems: SideMenuItem[] = [
    {
      id: 'nav-overview',
      title: '城市概览',
      icon: 'fas fa-info-circle',
      link: `/city-detail?city_id=${cityId}`,
      isActive: false
    },
    {
      id: 'nav-attractions',
      title: '景点',
      icon: 'fas fa-landmark',
      link: `/attraction-detail?city_id=${cityId}`,
      isActive: false
    },
    {
      id: 'nav-food',
      title: '美食',
      icon: 'fas fa-utensils',
      link: `/food-detail?city_id=${cityId}`,
      isActive: false
    },
    {
      id: 'nav-accommodation',
      title: '住宿',
      icon: 'fas fa-bed',
      link: `/accommodation-detail?city_id=${cityId}`,
      isActive: false
    },
    {
      id: 'nav-traffic',
      title: '交通指南',
      icon: 'fas fa-bus',
      link: `/traffic-guide?city_id=${cityId}`,
      isActive: true
    }
  ];

  return (
    <aside id="side-menu" className="w-full md:w-60 lg:w-64 mb-6 md:mb-0 md:mr-6">
      <div className="bg-white rounded-xl shadow-card p-4 sticky top-24">
        <h3 id="city-name-sidebar" className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-gray-100">
          {cityName}市
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.id}
              to={item.link}
              id={item.id}
              className={`flex items-center px-3 py-2 ${
                item.isActive 
                  ? 'bg-accent/10 text-primary font-medium' 
                  : 'text-text-secondary hover:bg-accent/10 hover:text-primary'
              } rounded-lg`}
            >
              <i className={`${item.icon} w-5 text-center mr-2`}></i>
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button 
            id="share-button" 
            className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 mb-2"
            onClick={onShareClick}
          >
            <i className="fas fa-share-alt mr-2"></i>
            <span>分享</span>
          </button>
          <button 
            id="collect-button" 
            className="w-full flex items-center justify-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            onClick={onCollectClick}
          >
            <i className="fas fa-bookmark mr-2"></i>
            <span>收藏</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideMenu;