
import { useState } from 'react';
import FilterButton from '../FilterButton';

const MapHeader = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    console.log(`筛选类型: ${filterId}`);
    // 这里应该实现筛选逻辑，但由于是静态原型，我们只做样式变化
  };

  return (
    <div id="map-header" className="hidden md:flex items-center justify-between bg-white shadow-sm px-6 py-3">
      <h1 className="text-xl font-bold text-text-primary">探索中国</h1>
      <div id="map-filters" className="flex items-center space-x-4">
        <FilterButton 
          id="all" 
          label="全部" 
          isActive={activeFilter === 'all'} 
          onClick={handleFilterClick} 
        />
        <FilterButton 
          id="cities" 
          label="城市" 
          isActive={activeFilter === 'cities'} 
          onClick={handleFilterClick} 
        />
        <FilterButton 
          id="attractions" 
          label="景点" 
          isActive={activeFilter === 'attractions'} 
          onClick={handleFilterClick} 
        />
        <FilterButton 
          id="food" 
          label="美食" 
          isActive={activeFilter === 'food'} 
          onClick={handleFilterClick} 
        />
        <FilterButton 
          id="accommodation" 
          label="住宿" 
          isActive={activeFilter === 'accommodation'} 
          onClick={handleFilterClick} 
        />
      </div>
    </div>
  );
};

export default MapHeader;