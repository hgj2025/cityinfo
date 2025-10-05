
import { useState, useEffect } from 'react';
import Header from './components/Header';
import MobileSearch from './components/MobileSearch';
import MapHeader from './components/MapHeader';
import MapMarker from './components/MapMarker';
import MapControls from './components/MapControls';
import MobileFilterButton from './components/MobileFilterButton';
import InfoDrawer from './components/InfoDrawer';
import { CityData, AttractionData } from './types';

const MapView = () => {
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'city' | 'attraction' | null>(null);
  const [mobileFilterDrawerOpen, setMobileFilterDrawerOpen] = useState(false);

  // Mock data for cities and attractions
  const cityData: Record<string, CityData> = {
    'beijing': {
      id: 'beijing',
      name: '北京',
      description: '中国首都，拥有悠久的历史和丰富的文化遗产，是政治、文化和国际交流中心。',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
      attractions: [
        { id: 'greatwall', name: '长城', type: '历史遗迹' },
        { id: 'forbidden-city', name: '故宫', type: '历史遗迹' },
        { id: 'summer-palace', name: '颐和园', type: '历史遗迹' }
      ],
      foods: [
        { id: 'peking-duck', name: '北京烤鸭', price: '¥198/只' },
        { id: 'zhajiang-noodles', name: '炸酱面', price: '¥30/碗' }
      ],
      accommodations: [
        { id: 'hotel1', name: '北京饭店', type: '豪华酒店', price: '¥800起/晚' },
        { id: 'hotel2', name: '如家快捷', type: '经济型', price: '¥300起/晚' }
      ]
    },
    'shanghai': {
      id: 'shanghai',
      name: '上海',
      description: '中国最大的经济中心城市，国际化大都市，融合了东西方文化的现代化城市。',
      image: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403',
      attractions: [
        { id: 'the-bund', name: '外滩', type: '城市景观' },
        { id: 'yu-garden', name: '豫园', type: '历史遗迹' }
      ],
      foods: [
        { id: 'xiaolongbao', name: '小笼包', price: '¥40/笼' },
        { id: 'shanghai-noodles', name: '上海阳春面', price: '¥25/碗' }
      ],
      accommodations: [
        { id: 'hotel3', name: '和平饭店', type: '豪华酒店', price: '¥1000起/晚' },
        { id: 'hotel4', name: '如家快捷', type: '经济型', price: '¥350起/晚' }
      ]
    },
    'xian': {
      id: 'xian',
      name: '西安',
      description: '中国历史文化名城，古丝绸之路的起点，拥有丰富的历史遗迹和文化资源。',
      image: 'https://images.unsplash.com/photo-1567292301-e17b60676b18',
      attractions: [
        { id: 'terracotta', name: '兵马俑', type: '博物馆' },
        { id: 'city-wall', name: '西安城墙', type: '历史遗迹' }
      ],
      foods: [
        { id: 'roujiamo', name: '肉夹馍', price: '¥15/个' },
        { id: 'biang-noodles', name: 'biangbiang面', price: '¥30/碗' }
      ],
      accommodations: [
        { id: 'hotel5', name: '西安香格里拉', type: '豪华酒店', price: '¥700起/晚' },
        { id: 'hotel6', name: '如家快捷', type: '经济型', price: '¥250起/晚' }
      ]
    },
    'chengdu': {
      id: 'chengdu',
      name: '成都',
      description: '四川省省会，以休闲生活方式和美食文化闻名，是中国西南地区的经济中心。',
      image: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57',
      attractions: [
        { id: 'panda-base', name: '大熊猫繁育研究基地', type: '自然景观' },
        { id: 'jinli-street', name: '锦里古街', type: '文化街区' }
      ],
      foods: [
        { id: 'hotpot', name: '川式火锅', price: '¥80/人' },
        { id: 'mapo-tofu', name: '麻婆豆腐', price: '¥30/份' }
      ],
      accommodations: [
        { id: 'hotel7', name: '成都香格里拉', type: '豪华酒店', price: '¥650起/晚' },
        { id: 'hotel8', name: '如家快捷', type: '经济型', price: '¥230起/晚' }
      ]
    },
    'guangzhou': {
      id: 'guangzhou',
      name: '广州',
      description: '广东省省会，中国南方的经济、文化中心，以粤菜和商贸闻名于世。',
      image: 'https://images.unsplash.com/photo-1522547902298-51566e4fb383',
      attractions: [
        { id: 'canton-tower', name: '广州塔', type: '现代建筑' },
        { id: 'chen-clan-academy', name: '陈家祠', type: '历史遗迹' }
      ],
      foods: [
        { id: 'dimsum', name: '广式点心', price: '¥60/人' },
        { id: 'wonton-noodles', name: '云吞面', price: '¥25/碗' }
      ],
      accommodations: [
        { id: 'hotel9', name: '广州白天鹅宾馆', type: '豪华酒店', price: '¥800起/晚' },
        { id: 'hotel10', name: '如家快捷', type: '经济型', price: '¥280起/晚' }
      ]
    }
  };

  // Mock data for attractions
  const attractionData: Record<string, AttractionData> = {
    'greatwall': {
      id: 'greatwall',
      name: '长城',
      city: 'beijing',
      cityName: '北京',
      type: '历史遗迹',
      description: '世界文化遗产，中华文明的伟大象征，蜿蜒于崇山峻岭之间。',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
      ticketPrice: '¥40起',
      openHours: '08:00-17:00'
    },
    'terracotta': {
      id: 'terracotta',
      name: '兵马俑',
      city: 'xian',
      cityName: '西安',
      type: '博物馆',
      description: '世界第八大奇迹，秦始皇陵的地下军团，展现古代军阵雄风。',
      image: 'https://images.unsplash.com/photo-1415298942647-1cd804f87326',
      ticketPrice: '¥120起',
      openHours: '08:30-17:00'
    }
  };

  // Set document title
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 地图浏览';
    return () => { document.title = originalTitle; };
  }, []);

  const handleMarkerClick = (id: string) => {
    if (cityData[id]) {
      setSelectedItemId(id);
      setSelectedItemType('city');
      setInfoDrawerOpen(true);
    } else if (attractionData[id]) {
      setSelectedItemId(id);
      setSelectedItemType('attraction');
      setInfoDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setInfoDrawerOpen(false);
  };

  const toggleMobileFilterDrawer = () => {
    setMobileFilterDrawerOpen(prevState => !prevState);
  };

  return (
    <div className="bg-bg-light min-h-screen">
      <Header />
      <MobileSearch />

      <main id="map-container" className="pt-16 md:pt-16 h-screen">
        <MapHeader />

        <div id="map-area" className="relative w-full h-full bg-gray-100">
          {/* 模拟地图 */}
          <img 
            src="https://flagcdn.com/w20/cn.png" 
            alt="中国地图" 
            data-category="地图" 
            className="w-full h-full object-contain"
          />

          {/* 地图标记点 */}
          <MapMarker 
            id="beijing" 
            top="25%" 
            left="60%" 
            icon="city" 
            label="北京" 
            onClick={handleMarkerClick} 
          />
          <MapMarker 
            id="shanghai" 
            top="35%" 
            left="70%" 
            icon="city" 
            label="上海" 
            onClick={handleMarkerClick} 
          />
          <MapMarker 
            id="xian" 
            top="40%" 
            left="50%" 
            icon="city" 
            label="西安" 
            onClick={handleMarkerClick} 
          />
          <MapMarker 
            id="chengdu" 
            top="50%" 
            left="40%" 
            icon="city" 
            label="成都" 
            onClick={handleMarkerClick} 
          />
          <MapMarker 
            id="guangzhou" 
            top="60%" 
            left="60%" 
            icon="city" 
            label="广州" 
            onClick={handleMarkerClick} 
          />
          <MapMarker 
            id="greatwall" 
            top="22%" 
            left="58%" 
            icon="monument" 
            label="长城" 
            onClick={handleMarkerClick} 
          />
          <MapMarker 
            id="terracotta" 
            top="38%" 
            left="48%" 
            icon="monument" 
            label="兵马俑" 
            onClick={handleMarkerClick} 
          />

          <MapControls />
          <MobileFilterButton 
            isOpen={mobileFilterDrawerOpen} 
            toggleDrawer={toggleMobileFilterDrawer} 
          />
        </div>

        <InfoDrawer 
          isOpen={infoDrawerOpen} 
          onClose={handleCloseDrawer}
          itemId={selectedItemId}
          itemType={selectedItemType}
          cityData={cityData}
          attractionData={attractionData}
        />
      </main>
    </div>
  );
};

export default MapView;