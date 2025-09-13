
import { Link } from 'react-router-dom';
import { InfoDrawerProps } from '../../types';
import styles from '../../styles.module.css';

const InfoDrawer = ({ 
  isOpen, 
  onClose, 
  itemId, 
  itemType, 
  cityData, 
  attractionData 
}: InfoDrawerProps) => {
  const drawerClass = isOpen ? styles.open : styles.closed;

  const renderCityInfo = (cityId: string) => {
    const city = cityData[cityId];
    if (!city) return null;

    return (
      <div className="mb-6">
        <div className="h-48 rounded-lg overflow-hidden mb-4">
          <img src={city.image} alt={city.name} data-category="城市" className="w-full h-full object-cover" />
        </div>
        <p className="text-text-secondary mb-4">{city.description}</p>
        <Link 
          to={`/city-detail?city_id=${city.id}`} 
          id="view-city-detail" 
          className="inline-block bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg"
        >
          查看详情
        </Link>

        {/* 景点部分 */}
        {city.attractions && city.attractions.length > 0 && (
          <div className="mb-6 mt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">热门景点</h3>
            <div className="space-y-3">
              {city.attractions.map(attraction => (
                <Link 
                  key={attraction.id}
                  to={`/attraction-detail?attraction_id=${attraction.id}`} 
                  id={`attraction-${attraction.id}`} 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{attraction.name}</h4>
                    <span className="text-xs text-accent">{attraction.type}</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 美食部分 */}
        {city.foods && city.foods.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">特色美食</h3>
            <div className="space-y-3">
              {city.foods.map(food => (
                <Link 
                  key={food.id}
                  to={`/food-detail?food_id=${food.id}`} 
                  id={`food-${food.id}`} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <h4 className="font-medium text-text-primary">{food.name}</h4>
                  <span className="text-sm text-accent">{food.price}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 住宿部分 */}
        {city.accommodations && city.accommodations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">住宿推荐</h3>
            <div className="space-y-3">
              {city.accommodations.map(hotel => (
                <Link 
                  key={hotel.id}
                  to={`/accommodation-detail?accommodation_id=${hotel.id}`} 
                  id={`hotel-${hotel.id}`} 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{hotel.name}</h4>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">{hotel.type}</span>
                      <span className="text-xs text-accent">{hotel.price}</span>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAttractionInfo = (attractionId: string) => {
    const attraction = attractionData[attractionId];
    if (!attraction) return null;

    return (
      <div className="mb-6">
        <div className="h-48 rounded-lg overflow-hidden mb-4">
          <img src={attraction.image} alt={attraction.name} data-category="景点" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center mb-3">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{attraction.type}</span>
          <span className="text-text-secondary text-sm ml-3">{attraction.cityName}</span>
        </div>
        <p className="text-text-secondary mb-4">{attraction.description}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary text-sm">门票价格</span>
            <span className="text-accent font-medium">{attraction.ticketPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">开放时间</span>
            <span className="text-text-primary">{attraction.openHours}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to={`/attraction-detail?attraction_id=${attraction.id}`} 
            id="view-attraction-detail" 
            className="flex-1 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-center"
          >
            查看详情
          </Link>
          <Link 
            to={`/city-detail?city_id=${attraction.city}`} 
            id={`view-city-${attraction.city}`} 
            className="bg-gray-100 hover:bg-gray-200 text-text-primary px-4 py-2 rounded-lg text-center"
          >
            查看{attraction.cityName}
          </Link>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!itemId) return null;

    if (itemType === 'city') {
      return renderCityInfo(itemId);
    } else if (itemType === 'attraction') {
      return renderAttractionInfo(itemId);
    }

    return null;
  };

  const getDrawerTitle = () => {
    if (!itemId) return '信息';

    if (itemType === 'city' && cityData[itemId]) {
      return cityData[itemId].name;
    } else if (itemType === 'attraction' && attractionData[itemId]) {
      return attractionData[itemId].name;
    }

    return '信息';
  };

  return (
    <div id="info-drawer" className={`${styles['map-drawer']} ${drawerClass} fixed top-16 right-0 bottom-0 w-full md:w-96 bg-white shadow-lg z-30 overflow-y-auto`}>
      <div id="drawer-header" className="flex items-center justify-between p-4 border-b">
        <h2 id="drawer-title" className="text-lg font-bold text-text-primary">{getDrawerTitle()}</h2>
        <button id="close-drawer" className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div id="drawer-content" className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoDrawer;