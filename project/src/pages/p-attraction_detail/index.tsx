
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import AttractionHeader from './components/AttractionHeader';
import AttractionContent from './components/AttractionContent';
import ShareModal from './components/ShareModal';
import Toast from './components/Toast';

const AttractionDetail: React.FC = () => {
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 景点详情';
    
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleGenerateReport = () => {
    setShowShareModal(false);
    showToast('报告生成成功，请在"我的收藏"中查看');
  };



  return (
    <div className="bg-bg-light min-h-screen">
      <Header />
      
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12">
        {/* 面包屑导航 */}
        <nav id="breadcrumb" className="flex items-center text-sm mb-6">
          <Link to="/home" className="text-text-secondary hover:text-primary">首页</Link>
          <i className="fas fa-chevron-right text-xs mx-2 text-gray-400"></i>
          <Link to="/city-detail?city_id=beijing" id="breadcrumb-city" className="text-text-secondary hover:text-primary">北京</Link>
          <i className="fas fa-chevron-right text-xs mx-2 text-gray-400"></i>
          <span className="text-primary font-medium">长城</span>
        </nav>

        {/* 左侧菜单 + 主内容区 */}
        <div className="flex flex-col md:flex-row">
          {/* 左侧菜单 */}
          <SideMenu />

          {/* 主内容区 */}
          <div id="attraction-content" className="flex-1">
            {/* 景点头部信息 */}
            <AttractionHeader onShareClick={handleShareClick} />
            
            {/* 景点详细内容 */}
            <AttractionContent />
          </div>
        </div>
      </main>

      <Footer />
      
      {/* 分享弹窗 */}
      <ShareModal 
        isVisible={showShareModal} 
        onClose={handleCloseShareModal} 
        onGenerateReport={handleGenerateReport} 
      />

      {/* 提示消息 */}
      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  );
};

export default AttractionDetail;