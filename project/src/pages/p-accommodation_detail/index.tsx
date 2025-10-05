
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import Header from './components/Header';
import MobileSearch from './components/MobileSearch';
import SideMenu from './components/SideMenu';
import ImageSlider from './components/ImageSlider';
import ShareModal from './components/ShareModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { AccommodationDetails } from './types';

const AccommodationDetailPage = () => {
  const [searchParams] = useSearchParams();
  const accommodationId = searchParams.get('accommodation_id') || 'jinling';
  
  const [accommodationDetails, setAccommodationDetails] = useState<AccommodationDetails | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 住宿详情';
    return () => { document.title = originalTitle; };
  }, []);

  // 加载住宿详情数据
  useEffect(() => {
    loadAccommodationDetails(accommodationId);
  }, [accommodationId]);

  const loadAccommodationDetails = (id: string) => {
    // 模拟数据加载
    const accommodations: Record<string, AccommodationDetails> = {
      "jinling": {
        name: "金陵饭店",
        type: "五星级酒店",
        area: "新街口/夫子庙商圈",
        priceRange: "¥680-1280",
        address: "南京市秦淮区中山南路2号",
        location: "距离夫子庙步行约15分钟，距离新街口地铁站步行约5分钟",
        phone: "+86 25 8472 2888"
      },
      "sofitel": {
        name: "南京索菲特银河大酒店",
        type: "五星级酒店",
        area: "河西商圈",
        priceRange: "¥750-1500",
        address: "南京市建邺区江东中路235号",
        location: "距离奥体中心步行约10分钟，距离地铁10号线元通站约500米",
        phone: "+86 25 8856 8888"
      }
    };
    
    setAccommodationDetails(accommodations[id] || accommodations.jinling);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCollectClick = () => {
    setIsCollected(!isCollected);
    showToastMessage(isCollected ? '已取消收藏' : '收藏成功');
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleNavigationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToastMessage('正在打开地图导航');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <MobileSearch />

      {/* 主内容区 */}
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12 flex flex-col md:flex-row">
        <SideMenu />

        {/* 主内容区 */}
        <div id="content-area" className="flex-1">
          {/* 面包屑导航 */}
          <nav id="breadcrumb" className="flex items-center text-sm mb-4 text-text-secondary">
            <Link to="/home" className="hover:text-accent">首页</Link>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <Link to="/city-detail?city_id=nanjing" className="hover:text-accent">南京</Link>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <Link to="/city-detail?city_id=nanjing&section=accommodation" className="hover:text-accent">住宿</Link>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <span id="accommodation-name-breadcrumb" className="text-accent">
              {accommodationDetails?.name || '金陵饭店'}
            </span>
          </nav>

          {/* 住宿详情卡片 */}
          <div id="accommodation-detail-card" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
            <ImageSlider />

            {/* 住宿信息 */}
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h1 id="accommodation-name" className="text-2xl font-bold text-text-primary mb-2">
                    {accommodationDetails?.name || '金陵饭店'}
                  </h1>
                  <div className="flex flex-wrap items-center text-sm text-text-secondary mb-2">
                    <span id="accommodation-type" className="bg-primary/10 text-primary px-2 py-1 rounded-full mr-3">
                      {accommodationDetails?.type || '五星级酒店'}
                    </span>
                    <span id="accommodation-area" className="flex items-center">
                      <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                      <span>{accommodationDetails?.area || '新街口/夫子庙商圈'}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <button 
                    id="share-button" 
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-text-secondary hover:bg-gray-50"
                    onClick={handleShareClick}
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>
                  <button 
                    id="collect-button" 
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-text-secondary hover:bg-gray-50"
                    onClick={handleCollectClick}
                  >
                    {isCollected ? (
                      <i className="fas fa-heart text-red-500"></i>
                    ) : (
                      <i className="far fa-heart"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* 价格区间 */}
              <div id="price-section" className="mb-6 pb-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-text-primary mb-3">价格区间</h2>
                <div className="flex items-center">
                  <span id="price-range" className="text-2xl font-bold text-accent">
                    {accommodationDetails?.priceRange || '¥680-1280'}
                  </span>
                  <span className="text-text-secondary text-sm ml-2">/ 晚</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">价格可能因季节、节假日和特殊活动而有所变动</p>
              </div>

              {/* 设施服务 */}
              <div id="facilities-section" className="mb-6 pb-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-text-primary mb-3">设施与服务</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-wifi text-accent"></i>
                    </div>
                    <span className="text-text-secondary">免费Wi-Fi</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-utensils text-accent"></i>
                    </div>
                    <span className="text-text-secondary">餐厅</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-swimming-pool text-accent"></i>
                    </div>
                    <span className="text-text-secondary">游泳池</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-dumbbell text-accent"></i>
                    </div>
                    <span className="text-text-secondary">健身中心</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-parking text-accent"></i>
                    </div>
                    <span className="text-text-secondary">停车场</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-coffee text-accent"></i>
                    </div>
                    <span className="text-text-secondary">早餐</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-concierge-bell text-accent"></i>
                    </div>
                    <span className="text-text-secondary">24小时前台</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${styles.facilityIcon} bg-accent/10 rounded-full mr-3`}>
                      <i className="fas fa-spa text-accent"></i>
                    </div>
                    <span className="text-text-secondary">SPA</span>
                  </div>
                </div>
              </div>

              {/* 预订链接 */}
              <div id="booking-section" className="mb-6 pb-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-text-primary mb-3">预订方式</h2>
                <div className="space-y-3">
                  <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" id="booking-link" className="flex items-center justify-between bg-accent text-white px-4 py-3 rounded-lg hover:bg-accent/90 transition-colors">
                    <span className="flex items-center">
                      <i className="fas fa-globe mr-2"></i>
                      <span>Booking.com预订</span>
                    </span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                  <a href="https://www.ctrip.com" target="_blank" rel="noopener noreferrer" id="ctrip-link" className="flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                    <span className="flex items-center">
                      <i className="fas fa-globe mr-2"></i>
                      <span>携程旅行预订</span>
                    </span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                  <div id="contact-info" className="flex items-center text-text-secondary mt-2">
                    <i className="fas fa-phone-alt mr-2"></i>
                    <span>预订电话: {accommodationDetails?.phone || '+86 25 8472 2888'}</span>
                  </div>
                </div>
              </div>

              {/* 地理位置 */}
              <div id="location-section">
                <h2 className="text-lg font-semibold text-text-primary mb-3">地理位置</h2>
                <div id="map-container" className="h-64 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83" alt="地图" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div id="address" className="text-text-secondary mb-3 md:mb-0">
                    <p className="mb-1">{accommodationDetails?.address || '南京市秦淮区中山南路2号'}</p>
                    <p className="text-sm">{accommodationDetails?.location || '距离夫子庙步行约15分钟，距离新街口地铁站步行约5分钟'}</p>
                  </div>
                  <a 
                    href="#" 
                    id="navigation-button" 
                    className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={handleNavigationClick}
                  >
                    <i className="fas fa-directions mr-2"></i>
                    <span>导航前往</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 周边推荐 */}
          <div id="nearby-recommendations" className="bg-white rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">周边景点推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 景点1 */}
              <Link to="/attraction-detail?attraction_id=fuzimiao" id="nearby-attraction-1" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img src="https://s.coze.cn/t/MgFOTJ0pr2s/" alt="夫子庙" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">夫子庙</h3>
                  <p className="text-xs text-text-secondary">步行约15分钟</p>
                </div>
              </Link>
              
              {/* 景点2 */}
              <Link to="/attraction-detail?attraction_id=qinhuai" id="nearby-attraction-2" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1518623001395-125242310d0c" alt="秦淮河" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">秦淮河</h3>
                  <p className="text-xs text-text-secondary">步行约10分钟</p>
                </div>
              </Link>
              
              {/* 景点3 */}
              <Link to="/attraction-detail?attraction_id=presidential" id="nearby-attraction-3" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1518623001395-125242310d0c" alt="总统府" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">总统府</h3>
                  <p className="text-xs text-text-secondary">步行约20分钟</p>
                </div>
              </Link>
            </div>
          </div>

          {/* 用户评价 */}
          <div id="user-reviews" className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">用户评价</h2>
              <div className="flex items-center">
                <div className="flex items-center text-yellow-400 mr-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-text-primary font-medium">4.5</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* 评价1 */}
              <div id="review-1" className="border-b border-gray-100 pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                    <span>L</span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">李先生</div>
                    <div className="text-xs text-text-secondary">2023年10月</div>
                  </div>
                </div>
                <div className="flex items-center text-yellow-400 text-sm mb-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-text-secondary text-sm">地理位置优越，服务一流，房间宽敞舒适。早餐种类丰富，品质很高。酒店历史悠久，是南京的地标性建筑，值得入住体验。</p>
              </div>
              
              {/* 评价2 */}
              <div id="review-2" className="border-b border-gray-100 pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                    <span>W</span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">王女士</div>
                    <div className="text-xs text-text-secondary">2023年9月</div>
                  </div>
                </div>
                <div className="flex items-center text-yellow-400 text-sm mb-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
                <p className="text-text-secondary text-sm">酒店位置很好，交通便利，周边商场、餐厅很多。房间设施有些老旧，但整体干净整洁。服务人员态度友好，总体来说是不错的住宿体验。</p>
              </div>
              
              {/* 评价3 */}
              <div id="review-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                    <span>Z</span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">张先生</div>
                    <div className="text-xs text-text-secondary">2023年8月</div>
                  </div>
                </div>
                <div className="flex items-center text-yellow-400 text-sm mb-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <p className="text-text-secondary text-sm">作为南京的老牌五星级酒店，金陵饭店不愧是经典之选。房间视野开阔，能俯瞰秦淮河风光。SPA和游泳池设施很棒，是商务和休闲旅行的理想选择。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 分享弹窗 */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        onShare={(platform: string) => {
          setIsShareModalOpen(false);
          let message = '';
          switch (platform) {
            case 'wechat':
              message = '已复制分享链接到剪贴板';
              break;
            case 'weibo':
              message = '已分享到微博';
              break;
            case 'qq':
              message = '已分享到QQ';
              break;
            case 'link':
              message = '已复制链接到剪贴板';
              break;
            default:
              message = '分享成功';
          }
          showToastMessage(message);
        }}
        accommodationId={accommodationId}
      />

      {/* 收藏成功提示 */}
      <Toast message={toastMessage} show={showToast} />

      <Footer />
    </div>
  );
};

export default AccommodationDetailPage;