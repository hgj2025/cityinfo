
import { useState } from 'react';
import { MobileFilterButtonProps } from '../../types';

const MobileFilterButton = ({ isOpen, toggleDrawer }: MobileFilterButtonProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    console.log(`筛选类型: ${filterId}`);
    toggleDrawer();
  };

  return (
    <>
      <div 
        id="mobile-filter-button" 
        className="md:hidden absolute bottom-4 left-4 z-20 bg-white rounded-full shadow-lg p-3"
        onClick={toggleDrawer}
      >
        <i className="fas fa-filter text-primary"></i>
      </div>

      {/* 移动端筛选抽屉 */}
      <div 
        id="mobile-filter-drawer" 
        className={`md:hidden absolute bottom-16 left-4 z-20 bg-white rounded-xl shadow-lg p-4 ${isOpen ? '' : 'hidden'}`}
      >
        <div className="flex flex-col space-y-2">
          <button 
            id="mobile-filter-all" 
            className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'all' ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => handleFilterClick('all')}
          >
            全部
          </button>
          <button 
            id="mobile-filter-cities" 
            className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'cities' ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => handleFilterClick('cities')}
          >
            城市
          </button>
          <button 
            id="mobile-filter-attractions" 
            className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'attractions' ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => handleFilterClick('attractions')}
          >
            景点
          </button>
          <button 
            id="mobile-filter-food" 
            className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'food' ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => handleFilterClick('food')}
          >
            美食
          </button>
          <button 
            id="mobile-filter-accommodation" 
            className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'accommodation' ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => handleFilterClick('accommodation')}
          >
            住宿
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterButton;