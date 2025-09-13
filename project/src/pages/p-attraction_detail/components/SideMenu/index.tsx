
import { Link } from 'react-router-dom';

const SideMenu: React.FC = () => {
  return (
    <aside id="side-menu" className="w-full md:w-60 mb-6 md:mb-0 md:mr-8">
      <div className="bg-white rounded-xl shadow-card p-4 sticky top-24">
        <h3 className="text-text-primary font-semibold text-lg mb-4 pb-2 border-b border-gray-100">北京景点导航</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/city-detail?city_id=beijing" id="nav-city-overview" className="flex items-center text-text-secondary hover:text-primary">
              <i className="fas fa-info-circle w-5 text-accent"></i>
              <span>城市概览</span>
            </Link>
          </li>
          <li>
            <Link to="#" id="nav-attractions" className="flex items-center text-primary font-medium">
              <i className="fas fa-landmark w-5 text-accent"></i>
              <span>景点</span>
            </Link>
            <ul className="ml-5 mt-2 space-y-2">
              <li>
                <Link to="/attraction-detail?attraction_id=greatwall" id="nav-attraction-greatwall" className="text-primary font-medium flex items-center">
                  <i className="fas fa-angle-right mr-1 text-xs"></i>
                  <span>长城</span>
                </Link>
              </li>
              <li>
                <Link to="/attraction-detail?attraction_id=forbidden_city" id="nav-attraction-forbidden-city" className="text-text-secondary hover:text-primary flex items-center">
                  <i className="fas fa-angle-right mr-1 text-xs"></i>
                  <span>故宫</span>
                </Link>
              </li>
              <li>
                <Link to="/attraction-detail?attraction_id=summer_palace" id="nav-attraction-summer-palace" className="text-text-secondary hover:text-primary flex items-center">
                  <i className="fas fa-angle-right mr-1 text-xs"></i>
                  <span>颐和园</span>
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/food-detail?city_id=beijing" id="nav-food" className="flex items-center text-text-secondary hover:text-primary">
              <i className="fas fa-utensils w-5 text-accent"></i>
              <span>美食</span>
            </Link>
          </li>
          <li>
            <Link to="/accommodation-detail?city_id=beijing" id="nav-accommodation" className="flex items-center text-text-secondary hover:text-primary">
              <i className="fas fa-bed w-5 text-accent"></i>
              <span>住宿</span>
            </Link>
          </li>
          <li>
            <Link to="/traffic-guide?city_id=beijing" id="nav-traffic" className="flex items-center text-text-secondary hover:text-primary">
              <i className="fas fa-bus w-5 text-accent"></i>
              <span>交通</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;