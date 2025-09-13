
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
  return (
    <section id="welcome-section" className="mb-10">
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96">
        <img 
          src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b" 
          alt="中国风景" 
          data-category="自然" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
          <div className="px-6 md:px-10 max-w-lg">
            <h1 id="welcome-title" className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              探索中华文化之美
            </h1>
            <p id="welcome-subtitle" className="text-white/90 text-sm md:text-base mb-6">
              深度了解中国城市的历史、文化、美食与风景，开启您的文化之旅
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/map-view" 
                id="map-entry-button" 
                className="bg-accent hover:bg-accent/90 text-white px-5 py-2 rounded-full flex items-center transition-colors"
              >
                <i className="fas fa-map-marked-alt mr-2"></i>
                <span>地图浏览</span>
              </Link>
              <a 
                href="#recommended-cities" 
                id="explore-button" 
                className="bg-white hover:bg-white/90 text-primary px-5 py-2 rounded-full flex items-center transition-colors"
              >
                <i className="fas fa-compass mr-2"></i>
                <span>开始探索</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;