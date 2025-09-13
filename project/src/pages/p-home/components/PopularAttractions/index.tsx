
import { Link } from 'react-router-dom';
import styles from '../../styles.module.css';

const PopularAttractions = () => {
  return (
    <section id="popular-attractions" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary text-xl md:text-2xl font-bold">热门景点</h2>
        <a href="#" id="view-all-attractions" className="text-accent hover:text-accent/80 flex items-center text-sm">
          <span>查看全部</span>
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 景点卡片 1 */}
        <Link 
          to="/attraction-detail?attraction_id=greatwall" 
          id="attraction-card-greatwall" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d" 
              alt="长城" 
              data-category="景点" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-primary font-semibold text-lg">长城</h3>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">历史遗迹</span>
            </div>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">
              世界文化遗产，中华文明的伟大象征，蜿蜒于崇山峻岭之间
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">北京</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-ticket-alt mr-1"></i>
                <span>¥40起</span>
              </span>
            </div>
          </div>
        </Link>

        {/* 景点卡片 2 */}
        <Link 
          to="/attraction-detail?attraction_id=westlake" 
          id="attraction-card-westlake" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1548013146-72479768bada" 
              alt="西湖" 
              data-category="景点" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-primary font-semibold text-lg">西湖</h3>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">自然风光</span>
            </div>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">
              湖光山色，十景名胜，千年文化底蕴的自然与人文景观
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">杭州</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-ticket-alt mr-1"></i>
                <span>免费</span>
              </span>
            </div>
          </div>
        </Link>

        {/* 景点卡片 3 */}
        <Link 
          to="/attraction-detail?attraction_id=terracotta" 
          id="attraction-card-terracotta" 
          className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
        >
          <div className="h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1415298942647-1cd804f87326" 
              alt="兵马俑" 
              data-category="景点" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-primary font-semibold text-lg">兵马俑</h3>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">博物馆</span>
            </div>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">
              世界第八大奇迹，秦始皇陵的地下军团，展现古代军阵雄风
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">西安</span>
              <span className="flex items-center text-accent">
                <i className="fas fa-ticket-alt mr-1"></i>
                <span>¥120起</span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default PopularAttractions;