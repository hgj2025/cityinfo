
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Food } from '../../types';
import styles from '../../styles.module.css';

interface FoodSectionProps {
  foods: Food[];
}

const FoodSection: React.FC<FoodSectionProps> = ({ foods }) => {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // 根据筛选条件过滤美食
  const filteredFoods = filter === 'all' 
    ? foods 
    : foods.filter(food => {
        if (filter === 'local') return food.category === '地方小吃';
        if (filter === 'specialty') return food.category === '特色菜肴';
        if (filter === 'dessert') return food.category === '甜品';
        return true;
      });

  return (
    <section id="food" className="mb-12">
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center">
            <i className="fas fa-utensils text-accent mr-2"></i>美食
          </h2>
          <div className="flex items-center space-x-2">
            <select 
              id="food-filter" 
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-accent"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">全部美食</option>
              <option value="local">地方小吃</option>
              <option value="specialty">特色菜肴</option>
              <option value="dessert">甜品</option>
            </select>
          </div>
        </div>
        
        <div id="food-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFoods.map(food => (
            <Link 
              key={food.id}
              to={`/food-detail?food_id=${food.id}`} 
              id={`food-card-${food.id.replace('nanjing_', '')}`} 
              className={`flex bg-white rounded-xl border border-gray-200 overflow-hidden ${styles['card-hover']}`}
            >
              <div className="w-1/3 overflow-hidden">
                <img 
                  src={food.imageUrl} 
                  alt={food.name} 
                  data-category="美食" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="text-text-primary font-semibold text-lg mb-1">{food.name}</h3>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">{food.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full">{food.category}</span>
                  <span className="flex items-center text-accent">
                    <i className="fas fa-yen-sign mr-1"></i>
                    <span>{food.price}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <a href="#" id="more-food-button" className="inline-flex items-center text-accent hover:text-accent/80">
            <span>查看更多美食</span>
            <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FoodSection;