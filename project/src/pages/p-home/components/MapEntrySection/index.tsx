
import { Link } from 'react-router-dom';

const MapEntrySection = () => {
  return (
    <section id="map-entry-section" className="mb-12">
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img 
            src="https://images.unsplash.com/photo-1552832230-c0197dd311b5" 
            alt="中国地图" 
            data-category="地图" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-4">地图浏览</h2>
              <p className="text-white/90 text-sm md:text-base mb-6 max-w-lg mx-auto">
                通过交互式地图探索中国各地的城市、景点、美食与文化，直观地规划您的旅行路线
              </p>
              <Link 
                to="/map-view" 
                id="map-view-button" 
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full inline-flex items-center transition-colors"
              >
                <i className="fas fa-map-marked-alt mr-2"></i>
                <span>打开地图</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapEntrySection;