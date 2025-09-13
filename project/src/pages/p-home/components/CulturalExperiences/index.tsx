
import { Link } from 'react-router-dom';
import styles from '../../styles.module.css';

const CulturalExperiences = () => {
  return (
    <section id="cultural-experiences" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary text-xl md:text-2xl font-bold">文化体验</h2>
        <a href="#" id="view-all-cultural" className="text-accent hover:text-accent/80 flex items-center text-sm">
          <span>查看全部</span>
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 文化体验卡片 1 */}
        <div 
          id="cultural-card-opera" 
          className={`bg-white rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row ${styles['card-hover']}`}
        >
          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
            <img 
              src="https://s.coze.cn/t/LwIyy6XKvqY/" 
              alt="京剧" 
              data-category="文化" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 md:w-2/3">
            <span className="inline-block bg-accent/10 text-accent text-xs px-2 py-1 rounded-full mb-2">非物质文化遗产</span>
            <h3 className="text-text-primary font-semibold text-lg mb-2">京剧艺术</h3>
            <p className="text-text-secondary text-sm mb-3">
              中国国粹，融合唱念做打，脸谱、服饰、音乐等多种艺术形式的戏曲表演
            </p>
            <div className="flex items-center text-xs text-text-secondary">
              <span className="flex items-center mr-3">
                <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                <span>北京</span>
              </span>
              <Link 
                to="/city-detail?city_id=beijing" 
                id="learn-more-beijing" 
                className="text-accent hover:underline"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>

        {/* 文化体验卡片 2 */}
        <div 
          id="cultural-card-tea" 
          className={`bg-white rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row ${styles['card-hover']}`}
        >
          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3" 
              alt="茶艺" 
              data-category="文化" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 md:w-2/3">
            <span className="inline-block bg-accent/10 text-accent text-xs px-2 py-1 rounded-full mb-2">传统文化</span>
            <h3 className="text-text-primary font-semibold text-lg mb-2">中国茶艺</h3>
            <p className="text-text-secondary text-sm mb-3">
              品茗悟道，体验中国茶文化的精髓，感受茶道中的禅意与美学
            </p>
            <div className="flex items-center text-xs text-text-secondary">
              <span className="flex items-center mr-3">
                <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                <span>杭州</span>
              </span>
              <Link 
                to="/city-detail?city_id=hangzhou" 
                id="learn-more-hangzhou" 
                className="text-accent hover:underline"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalExperiences;