
import { Link } from 'react-router-dom';
import { FilterType, SearchResultItem } from '../../types';
import styles from '../../styles.module.css';

interface SearchResultProps {
  activeFilter: FilterType;
}

const SearchResult = ({ activeFilter }: SearchResultProps) => {
  // Mock data for search results
  const searchResults: SearchResultItem[] = [
    {
      id: 'nanjing',
      type: 'city',
      title: '南京',
      description: '六朝古都，拥有丰富的历史文化遗产和自然风光',
      image: 'https://images.unsplash.com/photo-1555921015-5532091f6026',
      location: '江苏省',
      rating: 4.7,
      link: '/city-detail?city_id=nanjing'
    },
    {
      id: 'fuzimiao',
      type: 'attraction',
      title: '夫子庙',
      description: '南京著名的文化景区，集古建筑、商业、美食于一体',
      image: 'https://s.coze.cn/t/MgFOTJ0pr2s/',
      location: '南京',
      price: '免费',
      link: '/attraction-detail?attraction_id=fuzimiao'
    },
    {
      id: 'zhongshan',
      type: 'attraction',
      title: '中山陵',
      description: '孙中山先生的陵墓，建筑宏伟，环境优美',
      image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7',
      location: '南京',
      price: '¥30',
      link: '/attraction-detail?attraction_id=zhongshan'
    },
    {
      id: 'yaxuefensi',
      type: 'food',
      title: '鸭血粉丝汤',
      description: '南京特色小吃，鲜美可口，营养丰富',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
      location: '南京',
      price: '¥25/碗',
      link: '/food-detail?food_id=yaxuefensi'
    },
    {
      id: 'salted_duck',
      type: 'food',
      title: '盐水鸭',
      description: '南京名菜，肉质鲜嫩，咸香适口',
      image: 'https://images.unsplash.com/photo-1518983546435-91f8b87fe561',
      location: '南京',
      price: '¥68/只',
      link: '/food-detail?food_id=salted_duck'
    },
    {
      id: 'nanjing_hotel',
      type: 'accommodation',
      title: '南京金陵饭店',
      description: '五星级酒店，地理位置优越，服务一流',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      location: '南京',
      price: '¥680/晚起',
      link: '/accommodation-detail?accommodation_id=nanjing_hotel'
    }
  ];

  // Filter results based on active filter
  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(item => item.type === activeFilter);

  return (
    <section id="search-results" className="mb-8">
      <div id="results-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <Link 
            key={`${result.type}-${result.id}`}
            to={result.link}
            id={`result-${result.type}-${result.id}`} 
            className={`bg-white rounded-xl shadow-card overflow-hidden ${styles.cardHover}`}
          >
            <div className="flex h-full">
              <div className="w-1/3">
                <img 
                  src={result.image} 
                  alt={result.title} 
                  data-category={result.type} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-text-primary font-semibold text-lg">{result.title}</h3>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {result.type === 'city' && '城市'}
                    {result.type === 'attraction' && '景点'}
                    {result.type === 'food' && '美食'}
                    {result.type === 'accommodation' && '住宿'}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">{result.description}</p>
                <div className="flex items-center justify-between text-xs">
                  {result.type === 'city' ? (
                    <div className="flex items-center text-xs text-text-secondary">
                      <span className="flex items-center mr-3">
                        <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                        <span>{result.location}</span>
                      </span>
                      {result.rating && (
                        <span className="flex items-center">
                          <i className="fas fa-star text-accent mr-1"></i>
                          <span>{result.rating}</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <span className="text-text-secondary">{result.location}</span>
                      {result.price && (
                        <span className="flex items-center text-accent">
                          <i className={`fas ${result.type === 'attraction' ? 'fa-ticket-alt' : 'fa-yen-sign'} mr-1`}></i>
                          <span>{result.price}</span>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SearchResult;