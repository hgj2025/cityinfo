
import { Link } from 'react-router-dom';
import styles from '../../styles.module.css';

const FoodRecommendations = () => {
  return (
    <section id="food-recommendations" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary text-xl md:text-2xl font-bold">美食推荐</h2>
        <a href="#" id="view-all-food" className="text-accent hover:text-accent/80 flex items-center text-sm">
          <span>查看全部</span>
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 美食卡片 1 */}
        <Link 
          to="/food-detail?food_id=hotpot" 
          id="food-card-hotpot" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-40 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624" 
              alt="火锅" 
              data-category="美食" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-text-primary font-semibold text-lg mb-1">川式火锅</h3>
            <p className="text-text-secondary text-sm mb-2 line-clamp-2">
              麻辣鲜香，百味齐聚，体验川渝地区的特色美食文化
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">成都</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-yen-sign mr-1"></i>
                <span>¥80/人</span>
              </span>
            </div>
          </div>
        </Link>

        {/* 美食卡片 2 */}
        <Link 
          to="/food-detail?food_id=dimsum" 
          id="food-card-dimsum" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-40 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1563245372-f21724e3856d" 
              alt="点心" 
              data-category="美食" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-text-primary font-semibold text-lg mb-1">广式点心</h3>
            <p className="text-text-secondary text-sm mb-2 line-clamp-2">
              精致小巧，品种繁多，粤式早茶文化的代表
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">广州</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-yen-sign mr-1"></i>
                <span>¥60/人</span>
              </span>
            </div>
          </div>
        </Link>

        {/* 美食卡片 3 */}
        <Link 
          to="/food-detail?food_id=noodles" 
          id="food-card-noodles" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-40 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1555126634-323283e090fa" 
              alt="面条" 
              data-category="美食" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-text-primary font-semibold text-lg mb-1">兰州拉面</h3>
            <p className="text-text-secondary text-sm mb-2 line-clamp-2">
              清、香、麻、辣、烫，一碗面的五种滋味
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">兰州</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-yen-sign mr-1"></i>
                <span>¥15/碗</span>
              </span>
            </div>
          </div>
        </Link>

        {/* 美食卡片 4 */}
        <Link 
          to="/food-detail?food_id=duck" 
          id="food-card-duck" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-40 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1518983546435-91f8b87fe561" 
              alt="烤鸭" 
              data-category="美食" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-text-primary font-semibold text-lg mb-1">北京烤鸭</h3>
            <p className="text-text-secondary text-sm mb-2 line-clamp-2">
              外脆里嫩，色泽红亮，中国烹饪艺术的杰出代表
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">北京</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-yen-sign mr-1"></i>
                <span>¥198/只</span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FoodRecommendations;