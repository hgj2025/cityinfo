
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ShareModal from './components/ShareModal';
import FoodHeader from './components/FoodHeader';
import PracticalInfo from './components/PracticalInfo';
import SpecialDishes from './components/SpecialDishes';
import UserReviews from './components/UserReviews';
import LocationMap from './components/LocationMap';
import NearbyRecommendations from './components/NearbyRecommendations';
import RelatedFoods from './components/RelatedFoods';

// Types
import { FoodDetail, Dish, Review, NearbyItem } from './types';

const FoodDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 美食详情';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取URL参数
  const foodId = searchParams.get('food_id') || 'default';
  
  // 模拟数据 - 在实际应用中，这些数据会从API获取
  const foodDetail: FoodDetail = {
    id: foodId,
    title: '鸭血粉丝汤',
    rating: 4.7,
    reviewCount: 328,
    price: '¥25-45',
    category: '南京特色小吃',
    description: '鸭血粉丝汤是南京著名的传统小吃，以鸭血、粉丝为主料，配以鸭肠、鸭肝等鸭杂，加入葱姜蒜等调料熬制而成。汤色乳白，味道鲜美，是南京人早餐和夜宵的首选。',
    restaurantName: '老鸭粉丝汤（夫子庙店）',
    images: [
      'https://images.unsplash.com/photo-1518983546435-91f8b87fe561',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d',
      'https://images.unsplash.com/photo-1555126634-323283e090fa',
      'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b'
    ]
  };

  const specialDishes: Dish[] = [
    {
      id: '1',
      name: '招牌鸭血粉丝汤',
      description: '鸭血嫩滑，粉丝爽滑，汤底鲜美',
      price: '¥25/碗',
      image: 'https://images.unsplash.com/photo-1518983546435-91f8b87fe561'
    },
    {
      id: '2',
      name: '鸭油酥烧饼',
      description: '外酥里软，层次分明，香气四溢',
      price: '¥5/个',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d'
    },
    {
      id: '3',
      name: '盐水鸭',
      description: '肉质鲜嫩，咸香适口，不油不腻',
      price: '¥38/份',
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa'
    },
    {
      id: '4',
      name: '桂花糯米藕',
      description: '甜而不腻，桂花香气浓郁',
      price: '¥15/份',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d'
    }
  ];

  const reviews: Review[] = [
    {
      id: '1',
      userName: '张先生',
      date: '2023-05-15',
      rating: 5,
      comment: '南京必吃的美食之一，鸭血很嫩，粉丝很爽滑，汤底非常鲜美。早上来吃一碗，整个人都精神了。店面虽小但很干净，服务也很热情。强烈推荐！'
    },
    {
      id: '2',
      userName: '李女士',
      date: '2023-04-28',
      rating: 4,
      comment: '味道不错，但是周末人太多了，要排队等位。建议工作日来，或者早上早点来。鸭油酥烧饼也很好吃，酥脆可口，推荐搭配鸭血粉丝汤一起吃。'
    },
    {
      id: '3',
      userName: '王先生',
      date: '2023-03-10',
      rating: 4.5,
      comment: '作为南京人，这家店的鸭血粉丝汤是我的最爱。每次从外地回来都要来吃一碗。价格实惠，分量足，味道正宗。盐水鸭也很不错，肉质鲜嫩多汁。'
    }
  ];

  const nearbyItems: NearbyItem[] = [
    {
      id: '1',
      name: '夫子庙',
      type: '景点',
      distance: '步行5分钟',
      image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b',
      link: '/attraction-detail?attraction_id=fuzimiao'
    },
    {
      id: '2',
      name: '南京小笼包',
      type: '美食',
      distance: '步行3分钟',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
      link: '/food-detail?food_id=xiaolongbao'
    },
    {
      id: '3',
      name: '秦淮风光带',
      type: '购物',
      distance: '步行8分钟',
      image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b',
      link: ''
    }
  ];

  const relatedFoods: NearbyItem[] = [
    {
      id: '1',
      name: '盐水鸭',
      type: '南京特色',
      distance: '¥38/份',
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa',
      link: '/food-detail?food_id=yanshuiya'
    },
    {
      id: '2',
      name: '桂花糯米藕',
      type: '南京甜点',
      distance: '¥15/份',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
      link: '/food-detail?food_id=guihuanuomiou'
    },
    {
      id: '3',
      name: '牛肉锅贴',
      type: '南京小吃',
      distance: '¥20/份',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
      link: '/food-detail?food_id=niurouguotie'
    }
  ];

  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {/* 主内容区 */}
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12">
        {/* 面包屑导航 */}
        <div id="breadcrumb" className="flex items-center text-sm text-text-secondary mb-4">
          <Link to="/home" className="hover:text-accent">首页</Link>
          <i className="fas fa-chevron-right text-xs mx-2"></i>
          <Link to="/city-detail?city_id=nanjing" className="hover:text-accent">南京</Link>
          <i className="fas fa-chevron-right text-xs mx-2"></i>
          <span className="text-text-primary">鸭血粉丝汤</span>
        </div>

        {/* 美食详情内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧内容区 */}
          <div className="lg:col-span-2">
            {/* 美食头部信息 */}
            <FoodHeader food={foodDetail} onShare={handleOpenShareModal} />

            {/* 实用信息 */}
            <PracticalInfo />

            {/* 特色菜品 */}
            <SpecialDishes dishes={specialDishes} />

            {/* 用户评价 */}
            <UserReviews reviews={reviews} />
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1">
            {/* 地理位置与地图 */}
            <LocationMap />

            {/* 周边推荐 */}
            <NearbyRecommendations items={nearbyItems} />

            {/* 相关美食推荐 */}
            <RelatedFoods foods={relatedFoods} />
          </div>
        </div>
      </main>

      {/* 分享弹窗 */}
      <ShareModal isOpen={isShareModalOpen} onClose={handleCloseShareModal} />

      <Footer />
    </div>
  );
};

export default FoodDetailPage;