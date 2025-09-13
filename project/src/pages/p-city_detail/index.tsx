
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

// 组件导入
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import CityHeader from './components/CityHeader';
import OverviewSection from './components/OverviewSection';
import AttractionSection from './components/AttractionSection';
import FoodSection from './components/FoodSection';
import AccommodationSection from './components/AccommodationSection';
import TrafficSection from './components/TrafficSection';
import ShareModal from './components/ShareModal';

// 类型导入
import { Attraction, Food, Accommodation, TransportConnection, CityData } from './types';

const CityDetail = () => {
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('city_id') || 'nanjing';
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // 城市数据
  const cityData: CityData = {
    id: 'nanjing',
    name: '南京',
    slogan: '六朝古都，十朝都会，中华文明的重要发祥地之一',
    imageUrl: 'https://images.unsplash.com/photo-1555921015-5532091f6026'
  };
  
  // 景点数据
  const attractions: Attraction[] = [
    {
      id: 'nanjing_presidential_palace',
      name: '总统府',
      category: '历史遗迹',
      description: '中国近代史上重要的历史建筑，见证了中国近代历史的变迁，曾是太平天国天王府、清朝两江总督署、中华民国临时政府等。',
      location: '玄武区长江路292号',
      price: '¥40',
      imageUrl: 'https://images.unsplash.com/photo-1518623001395-125242310d0c'
    },
    {
      id: 'nanjing_confucius_temple',
      name: '夫子庙',
      category: '历史遗迹',
      description: '南京夫子庙是中国文化地标，集儒学文化、民俗文化、秦淮风情于一体，是南京人气最旺的景点之一。',
      location: '秦淮区贡院街1号',
      price: '¥30',
      imageUrl: 'https://s.coze.cn/t/MgFOTJ0pr2s/'
    },
    {
      id: 'nanjing_zhongshan_mausoleum',
      name: '中山陵',
      category: '历史遗迹',
      description: '中山陵是中国近代伟大的民主革命先行者孙中山先生的陵墓，建筑风格中西合璧，庄严肃穆。',
      location: '玄武区钟山风景区内',
      price: '免费',
      imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7'
    },
    {
      id: 'nanjing_city_wall',
      name: '明城墙',
      category: '历史遗迹',
      description: '南京明城墙是中国现存规模最大、保存最完整的城墙，被誉为"中华第一城墙"，是明朝都城防御工事的杰出代表。',
      location: '玄武区玄武门',
      price: '¥35',
      imageUrl: 'https://images.unsplash.com/photo-1416349445411-12ee7d689875'
    },
    {
      id: 'nanjing_xuanwu_lake',
      name: '玄武湖',
      category: '自然风光',
      description: '玄武湖是南京最大的城内公园，也是中国最大的皇家园林湖泊，湖中有五个小岛，湖光山色，景色秀丽。',
      location: '玄武区玄武门1号',
      price: '免费',
      imageUrl: 'https://images.unsplash.com/photo-1418833309618-f98e69067c54'
    },
    {
      id: 'nanjing_memorial_hall',
      name: '侵华日军南京大屠杀遇难同胞纪念馆',
      category: '博物馆',
      description: '纪念馆是为纪念在南京大屠杀中死难的30多万同胞而建立的，是进行爱国主义教育的重要基地。',
      location: '建邺区水西门大街418号',
      price: '免费',
      imageUrl: 'https://images.unsplash.com/photo-1555921015-5532091f6026'
    }
  ];
  
  // 美食数据
  const foods: Food[] = [
    {
      id: 'nanjing_duck_blood_soup',
      name: '鸭血粉丝汤',
      category: '地方小吃',
      description: '南京特色小吃，汤清味鲜，鸭血嫩滑，粉丝爽口，是南京人喜爱的传统美食。',
      price: '¥15-25/碗',
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d'
    },
    {
      id: 'nanjing_salted_duck',
      name: '盐水鸭',
      category: '特色菜肴',
      description: '南京名菜，选用优质麻鸭，经特殊工艺腌制而成，肉质鲜嫩，咸淡适中，风味独特。',
      price: '¥60-80/只',
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d'
    },
    {
      id: 'nanjing_beef_dumplings',
      name: '牛肉锅贴',
      category: '地方小吃',
      description: '南京特色小吃，皮薄馅大，外酥里嫩，牛肉馅料鲜美多汁，是南京人早餐的常见选择。',
      price: '¥15-20/份',
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d'
    },
    {
      id: 'nanjing_osmanthus_duck',
      name: '桂花鸭',
      category: '特色菜肴',
      description: '南京传统名菜，将鸭肉与桂花、蜂蜜等调料一起烹制，甜而不腻，香气扑鼻。',
      price: '¥88-108/份',
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d'
    }
  ];
  
  // 住宿数据
  const accommodations: Accommodation[] = [
    {
      id: 'nanjing_jinling_hotel',
      name: '金陵饭店',
      category: '五星级酒店',
      description: '南京地标性酒店，位于市中心，交通便利，设施豪华，服务一流，是商务和休闲旅行的理想选择。',
      location: '鼓楼区汉中路2号',
      price: '¥800-1500/晚',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      amenities: ['免费Wi-Fi', '健身中心', '游泳池', '餐厅', '会议室']
    },
    {
      id: 'nanjing_confucius_temple_inn',
      name: '夫子庙客栈',
      category: '特色民宿',
      description: '位于夫子庙景区附近的传统风格民宿，环境幽静，装修古色古香，让您体验老南京的生活方式。',
      location: '秦淮区贡院街附近',
      price: '¥300-500/晚',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      amenities: ['免费Wi-Fi', '空调', '免费早餐', '24小时热水']
    },
    {
      id: 'nanjing_youth_hostel',
      name: '南京国际青年旅舍',
      category: '青年旅舍',
      description: '经济实惠的住宿选择，干净整洁，提供多人间和独立房间，是背包客和学生旅行者的理想选择。',
      location: '鼓楼区中央路18号',
      price: '¥60-200/晚',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      amenities: ['免费Wi-Fi', '公共厨房', '行李寄存', '洗衣服务']
    }
  ];
  
  // 交通数据
  const transportConnections: TransportConnection[] = [
    {
      from: '南京禄口国际机场',
      to: '市区',
      routes: [
        {
          type: '机场大巴',
          price: '约¥20-30/人',
          time: '约40-60分钟（视交通情况）',
          route: '有多条线路，可到达南京火车站、新街口、河西等地'
        },
        {
          type: '地铁',
          price: '约¥6-9/人',
          time: '约60-80分钟',
          route: '乘坐地铁S1号线至南京南站，换乘地铁1号线或3号线前往市区'
        },
        {
          type: '出租车',
          price: '约¥150-200',
          time: '约40-60分钟（视交通情况）',
          route: '直达市区各地'
        }
      ]
    },
    {
      from: '南京站（老火车站）',
      to: '市区',
      routes: [
        {
          type: '地铁',
          price: '约¥2-5/人',
          time: '约15-30分钟',
          route: '乘坐地铁1号线可到达新街口、鼓楼等市中心地区'
        },
        {
          type: '公交',
          price: '约¥2/人',
          time: '约20-40分钟（视交通情况）',
          route: '多条公交线路可到达市区各地'
        },
        {
          type: '出租车',
          price: '约¥20-40',
          time: '约15-30分钟（视交通情况）',
          route: '直达市区各地'
        }
      ]
    },
    {
      from: '南京南站',
      to: '市区',
      routes: [
        {
          type: '地铁',
          price: '约¥2-5/人',
          time: '约15-30分钟',
          route: '乘坐地铁1号线可到达新街口、鼓楼等市中心地区；乘坐地铁3号线可到达夫子庙等景点'
        },
        {
          type: '公交',
          price: '约¥2/人',
          time: '约30-50分钟（视交通情况）',
          route: '多条公交线路可到达市区各地'
        },
        {
          type: '出租车',
          price: '约¥30-60',
          time: '约20-40分钟（视交通情况）',
          route: '直达市区各地'
        }
      ]
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 南京';
    return () => { document.title = originalTitle; };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {/* 主内容区 */}
      <div className="container mx-auto px-4 pt-24 md:pt-20 pb-12 flex flex-col md:flex-row">
        {/* 左侧菜单 */}
        <Sidebar cityName={cityData.name} />

        {/* 主内容 */}
        <main id="main-content" className="flex-1">
          {/* 面包屑导航 */}
          <div id="breadcrumb" className="flex items-center text-sm text-text-secondary mb-4">
            <Link to="/home" className="hover:text-accent">首页</Link>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <span id="breadcrumb-city" className="text-text-primary">{cityData.name}</span>
          </div>

          {/* 城市头部 */}
          <CityHeader 
            cityData={cityData} 
            onShare={() => setIsShareModalOpen(true)} 
          />

          {/* 城市概览 */}
          <OverviewSection />

          {/* 景点列表 */}
          <AttractionSection attractions={attractions} />

          {/* 美食列表 */}
          <FoodSection foods={foods} />

          {/* 住宿列表 */}
          <AccommodationSection accommodations={accommodations} />

          {/* 交通信息 */}
          <TrafficSection 
            transportConnections={transportConnections} 
            cityId={cityData.id} 
          />
        </main>
      </div>

      {/* 分享弹窗 */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        cityName={cityData.name} 
      />

      <Footer />
    </div>
  );
};

export default CityDetail;