
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="main-header" className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div id="logo-container" className="flex items-center">
          <Link to="/home" className="flex items-center">
            <i className="fas fa-map-marked-alt text-accent text-2xl mr-2"></i>
            <span className="text-primary font-bold text-xl">锦绣中华行</span>
          </Link>
        </div>

        {/* 搜索框 */}
        <div id="search-container" className="hidden md:flex items-center flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              id="search-input" 
              placeholder="搜索城市、景点、美食..." 
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:border-accent focus:outline-none"
            />
            <button id="search-button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav id="main-nav" className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-text-secondary hover:text-primary py-1">首页</Link>
          <Link to="/map-view" className="text-text-secondary hover:text-primary py-1">地图浏览</Link>
          <Link to="/collection-my" className="text-text-secondary hover:text-primary py-1">我的收藏</Link>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button id="language-switch" className="flex items-center text-text-secondary hover:text-primary">
            <i className="fas fa-globe mr-1"></i>
            <span>中文</span>
            <i className="fas fa-chevron-down text-xs ml-1"></i>
          </button>
          <button id="user-profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
            <i className="fas fa-user"></i>
          </button>
        </nav>

        {/* 移动端菜单按钮 */}
        <button 
          id="mobile-menu-button" 
          className="md:hidden text-text-primary"
          onClick={toggleMobileMenu}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <nav className="container mx-auto px-4 space-y-2">
            <Link to="/home" className="block py-2 text-text-secondary hover:text-primary">首页</Link>
            <Link to="/map-view" className="block py-2 text-text-secondary hover:text-primary">地图浏览</Link>
            <Link to="/collection-my" className="block py-2 text-text-secondary hover:text-primary">我的收藏</Link>
            <div className="border-t border-gray-100 my-2"></div>
            <button className="flex items-center py-2 text-text-secondary hover:text-primary">
              <i className="fas fa-globe mr-2"></i>
              <span>切换语言</span>
            </button>
            <button className="flex items-center py-2 text-text-secondary hover:text-primary">
              <i className="fas fa-user mr-2"></i>
              <span>个人中心</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;