
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import MobileSearch from './components/MobileSearch';
import SideMenu from './components/SideMenu';
import TrafficContent from './components/TrafficContent';
import Footer from './components/Footer';
import ShareModal from './components/ShareModal';
import CollectToast from './components/CollectToast';

const TrafficGuidePage = () => {
  const [searchParams] = useSearchParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollectToast, setShowCollectToast] = useState(false);
  
  // 获取URL参数
  const cityId = searchParams.get('city_id') || 'nanjing';
  
  // 城市名称映射
  const cityNames: Record<string, string> = {
    'nanjing': '南京',
    'beijing': '北京',
    'shanghai': '上海',
    'hangzhou': '杭州',
    'suzhou': '苏州',
    'chengdu': '成都'
  };
  
  // 获取城市名称
  const cityName = cityNames[cityId] || '南京';

  // 处理分享按钮点击
  const handleShareClick = () => {
    setShowShareModal(true);
  };

  // 处理收藏按钮点击
  const handleCollectClick = () => {
    setShowCollectToast(true);
    
    // 3秒后隐藏提示
    setTimeout(() => {
      setShowCollectToast(false);
    }, 3000);
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${cityName} - 交通指南`;
    return () => { document.title = originalTitle; };
  }, [cityName]);

  return (
    <div className="bg-bg-light min-h-screen">
      <Header cityId={cityId} />
      <MobileSearch />
      
      {/* 主内容区 */}
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12 flex flex-col md:flex-row">
        {/* 左侧菜单 */}
        <SideMenu 
          cityId={cityId} 
          cityName={cityName} 
          onShareClick={handleShareClick} 
          onCollectClick={handleCollectClick} 
        />

        {/* 主内容区域 */}
        <TrafficContent cityId={cityId} cityName={cityName} />
      </main>

      <Footer />
      
      {/* 模态框和提示 */}
      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
      {showCollectToast && <CollectToast />}
    </div>
  );
};

export default TrafficGuidePage;
