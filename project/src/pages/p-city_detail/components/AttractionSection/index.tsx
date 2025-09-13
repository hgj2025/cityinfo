
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Attraction } from '../../types';
import styles from '../../styles.module.css';

interface AttractionSectionProps {
  attractions: Attraction[];
}

const AttractionSection: React.FC<AttractionSectionProps> = ({ attractions }) => {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // 根据筛选条件过滤景点
  const filteredAttractions = filter === 'all' 
    ? attractions 
    : attractions.filter(attraction => {
        if (filter === 'historical') return attraction.category === '历史遗迹';
        if (filter === 'natural') return attraction.category === '自然风光';
        if (filter === 'museum') return attraction.category === '博物馆';
        return true;
      });

  return (
    <section id="attractions" className="mb-12">
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center">
            <i className="fas fa-landmark text-accent mr-2"></i>景点
          </h2>
          <div className="flex items-center space-x-2">
            <select 
              id="attraction-filter" 
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-accent"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">全部景点</option>
              <option value="historical">历史遗迹</option>
              <option value="natural">自然风光</option>
              <option value="museum">博物馆</option>
            </select>
          </div>
        </div>
        
        <div id="attractions-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map(attraction => (
            <Link 
              key={attraction.id}
              to={`/attraction-detail?attraction_id=${attraction.id}`} 
              id={`attraction-card-${attraction.id.replace('nanjing_', '')}`} 
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${styles['card-hover']}`}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={attraction.imageUrl} 
                  alt={attraction.name} 
                  data-category="景点" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-text-primary font-semibold text-lg">{attraction.name}</h3>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{attraction.category}</span>
                </div>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">{attraction.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-text-secondary">
                    <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                    <span>{attraction.location}</span>
                  </span>
                  <span className="flex items-center text-accent">
                    <i className="fas fa-ticket-alt mr-1"></i>
                    <span>{attraction.price}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <a href="#" id="more-attractions-button" className="inline-flex items-center text-accent hover:text-accent/80">
            <span>查看更多景点</span>
            <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AttractionSection;