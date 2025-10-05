
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

// 导入组件
import Header from './components/Header';
import MobileSearch from './components/MobileSearch';
import WelcomeSection from './components/WelcomeSection';
import RecommendedCities from './components/RecommendedCities';
import PopularAttractions from './components/PopularAttractions';
import CulturalExperiences from './components/CulturalExperiences';
import MapEntrySection from './components/MapEntrySection';
import FoodRecommendations from './components/FoodRecommendations';
import Footer from './components/Footer';

const HomePage = () => {
  useNavigate();

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 首页';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <Header />

      {/* 移动端搜索栏 */}
      <MobileSearch />

      {/* 主内容区 */}
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12">
        {/* 欢迎区域 */}
        <WelcomeSection />

        {/* 推荐城市 */}
        <RecommendedCities />

        {/* 热门景点 */}
        <PopularAttractions />

        {/* 文化体验 */}
        <CulturalExperiences />

        {/* 地图浏览入口 */}
        <MapEntrySection />

        {/* 美食推荐 */}
        <FoodRecommendations />
      </main>

      {/* 底部区域 */}
      <Footer />
    </div>
  );
};

export default HomePage;