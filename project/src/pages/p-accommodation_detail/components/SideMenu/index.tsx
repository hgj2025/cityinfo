
import { Link } from 'react-router-dom';

const SideMenu = () => {
  return (
    <aside id="side-menu" className="w-full md:w-60 lg:w-64 mb-6 md:mb-0 md:mr-6">
      <div className="bg-white rounded-xl shadow-card p-4 sticky top-24">
        <h3 id="city-name-sidebar" className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-gray-100">南京</h3>
        <nav className="space-y-1">
          <Link 
            to="/city-detail?city_id=nanjing" 
            id="nav-overview" 
            className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg"
          >
            <i className="fas fa-info-circle w-5 mr-2"></i>
            <span>城市概览</span>
          </Link>
          <Link 
            to="/city-detail?city_id=nanjing&section=attractions" 
            id="nav-attractions" 
            className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg"
          >
            <i className="fas fa-landmark w-5 mr-2"></i>
            <span>景点</span>
          </Link>
          <Link 
            to="/city-detail?city_id=nanjing&section=food" 
            id="nav-food" 
            className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg"
          >
            <i className="fas fa-utensils w-5 mr-2"></i>
            <span>美食</span>
          </Link>
          <Link 
            to="/city-detail?city_id=nanjing&section=accommodation" 
            id="nav-accommodation" 
            className="flex items-center px-3 py-2 bg-accent/10 text-accent rounded-lg"
          >
            <i className="fas fa-bed w-5 mr-2"></i>
            <span>住宿</span>
          </Link>
          <Link 
            to="/traffic-guide?city_id=nanjing" 
            id="nav-traffic" 
            className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg"
          >
            <i className="fas fa-bus w-5 mr-2"></i>
            <span>交通</span>
          </Link>
        </nav>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-text-secondary mb-3">相关城市</h4>
          <div className="space-y-2">
            <Link 
              to="/city-detail?city_id=suzhou" 
              id="related-city-suzhou" 
              className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg text-sm"
            >
              <i className="fas fa-city w-4 mr-2"></i>
              <span>苏州</span>
            </Link>
            <Link 
              to="/city-detail?city_id=hangzhou" 
              id="related-city-hangzhou" 
              className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg text-sm"
            >
              <i className="fas fa-city w-4 mr-2"></i>
              <span>杭州</span>
            </Link>
            <Link 
              to="/city-detail?city_id=yangzhou" 
              id="related-city-yangzhou" 
              className="flex items-center px-3 py-2 text-text-secondary hover:bg-accent/10 hover:text-accent rounded-lg text-sm"
            >
              <i className="fas fa-city w-4 mr-2"></i>
              <span>扬州</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideMenu;