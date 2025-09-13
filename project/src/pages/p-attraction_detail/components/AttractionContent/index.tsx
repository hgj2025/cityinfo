
import { Link } from 'react-router-dom';
import styles from '../../styles.module.css';
import { RestaurantInfo, ShoppingInfo, ReviewInfo } from '../../types';

const AttractionContent: React.FC = () => {
  const restaurants: RestaurantInfo[] = [
    {
      id: 'greatwall_restaurant',
      name: '长城农家院',
      description: '特色农家菜，环境朴实，味道地道',
      rating: 4.6,
      price: '¥80/人',
      image: {
        src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
        alt: '餐厅',
        category: '美食'
      }
    },
    {
      id: 'greatwall_restaurant2',
      name: '八达岭饭店',
      description: '提供北京特色菜，环境整洁舒适',
      rating: 4.3,
      price: '¥120/人',
      image: {
        src: 'https://images.unsplash.com/photo-1555126634-323283e090fa',
        alt: '餐厅',
        category: '美食'
      }
    }
  ];

  const shoppingPlaces: ShoppingInfo[] = [
    {
      name: '长城纪念品商店',
      description: '各类长城主题纪念品，价格适中',
      location: '位于景区出口处',
      image: {
        src: 'https://images.unsplash.com/photo-1445053023192-8d45cb66099d',
        alt: '纪念品',
        category: '购物'
      }
    },
    {
      name: '民间工艺品店',
      description: '传统手工艺品，具有收藏价值',
      location: '位于游客中心附近',
      image: {
        src: 'https://images.unsplash.com/photo-1516651029879-bcd191e7d33b',
        alt: '工艺品',
        category: '购物'
      }
    }
  ];

  const reviews: ReviewInfo[] = [
    {
      id: '1',
      author: '李先生',
      initial: 'L',
      rating: 5,
      date: '2023年10月',
      content: '八达岭长城真是名不虚传，景色壮观，历史感强烈。秋季前往，层林尽染，美不胜收。建议早上去，人少一些，拍照效果更好。台阶较陡，要做好爬山的准备。'
    },
    {
      id: '2',
      author: '王女士',
      initial: 'W',
      rating: 4,
      date: '2023年8月',
      content: '慕田峪长城比八达岭人少一些，风景同样壮观。夏季去有点热，但缆车很方便。长城上的台阶高低不一，要注意安全。周边的农家乐味道不错，很地道。'
    },
    {
      id: '3',
      author: '张先生',
      initial: 'Z',
      rating: 4.5,
      date: '2023年5月',
      content: '司马台长城保存了原始风貌，没有过度商业化，很有历史感。夜游项目很特别，灯光效果很美。不过这段长城比较陡峭，体力要求较高，建议量力而行。'
    }
  ];

  const handleMapNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // 实际项目中这里会调用地图API
    return '已打开地图导航';
  };

  return (
    <>
      {/* 景点介绍与历史文化背景 */}
      <section id="attraction-intro" className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">景点介绍与历史文化背景</h2>
        <div className="space-y-4 text-text-secondary">
          <p>长城，又称万里长城，是中国古代的军事防御工程，也是世界上最伟大的建筑之一。它东起山海关，西至嘉峪关，全长超过21,196公里，横跨中国北部的广大区域。</p>
          <p>长城始建于春秋战国时期，各国为了防御外敌入侵，在边境修筑城墙。秦始皇统一中国后，为抵御匈奴的侵扰，将北方的城墙连接起来，形成了最早的统一长城。此后历代王朝都对长城进行了修缮和扩建，现存的大部分长城是明朝时期修建的。</p>
          <p>长城不仅是军事防御工程，更是中华民族坚韧不拔、自强不息精神的象征。它见证了中国两千多年的历史变迁，承载着丰富的历史文化内涵。1987年，长城被联合国教科文组织列入《世界遗产名录》。</p>
          <p>北京地区的长城主要包括八达岭、慕田峪、司马台、金山岭等段落，其中八达岭长城是最早向游客开放的长城景区，也是保存最完好、最具代表性的一段。</p>
        </div>
      </section>

      {/* 开放时间、门票价格、推荐游览时长信息 */}
      <section id="attraction-info" className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">实用信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="opening-hours" className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <i className="fas fa-clock text-accent mr-2"></i>
              开放时间
            </h3>
            <div className="ml-6 text-text-secondary">
              <p><span className="font-medium">旺季（4月1日-10月31日）：</span>7:30-17:30</p>
              <p><span className="font-medium">淡季（11月1日-3月31日）：</span>8:00-17:00</p>
              <p className="text-sm italic mt-1">* 最晚入园时间为闭园前1小时</p>
            </div>
          </div>
          <div id="best-season" className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <i className="fas fa-calendar-alt text-accent mr-2"></i>
              最佳游览季节
            </h3>
            <div className="ml-6 text-text-secondary">
              <p>春季（4-5月）和秋季（9-10月）</p>
              <p className="text-sm mt-1">春季山花烂漫，秋季层林尽染，是拍摄长城的最佳时节</p>
            </div>
          </div>
          <div id="ticket-info" className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <i className="fas fa-ticket-alt text-accent mr-2"></i>
              门票价格与购票方式
            </h3>
            <div className="ml-6 text-text-secondary">
              <p><span className="font-medium">八达岭长城：</span>旺季40元/人，淡季35元/人</p>
              <p><span className="font-medium">慕田峪长城：</span>旺季45元/人，淡季40元/人</p>
              <p><span className="font-medium">司马台长城：</span>40元/人</p>
              <p className="text-sm mt-1">可在景区售票处现场购票，也可通过官方网站或各大旅游平台提前预订</p>
            </div>
          </div>
          <div id="duration" className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <i className="fas fa-hourglass-half text-accent mr-2"></i>
              推荐游览时长
            </h3>
            <div className="ml-6 text-text-secondary">
              <p>3-4小时</p>
              <p className="text-sm mt-1">建议预留充足时间，长城台阶较陡，游览过程需要适当休息</p>
            </div>
          </div>
        </div>
      </section>

      {/* 地理位置与地图导航 */}
      <section id="attraction-location" className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center justify-between">
          <span>地理位置</span>
          <a 
            href="#" 
            id="map-navigation" 
            className="text-accent text-sm flex items-center hover:underline"
            onClick={handleMapNavigation}
          >
            <i className="fas fa-directions mr-1"></i>
            <span>导航到这里</span>
          </a>
        </h2>
        <div id="map-container" className="h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img 
            src="https://images.unsplash.com/photo-1562680787-b07abbd00235" 
            alt="地图" 
            data-category="地图" 
            className="w-full h-full object-cover"
          />
        </div>
        <div id="location-details" className="text-text-secondary">
          <p className="flex items-start mb-2">
            <i className="fas fa-map-marker-alt text-accent mt-1 mr-2"></i>
            <span>
              <span className="font-medium">八达岭长城：</span>北京市延庆区八达岭特区<br />
              <span className="font-medium">慕田峪长城：</span>北京市怀柔区渤海镇慕田峪村<br />
              <span className="font-medium">司马台长城：</span>北京市密云区古北口镇司马台村
            </span>
          </p>
          <p className="flex items-start">
            <i className="fas fa-bus text-accent mt-1 mr-2"></i>
            <span>
              <span className="font-medium">八达岭长城交通：</span>可乘坐877路公交车或S2线列车到达八达岭站<br />
              <span className="font-medium">慕田峪长城交通：</span>可乘坐916路公交车到东直门，然后换乘H23或H24路到慕田峪<br />
              <span className="font-medium">司马台长城交通：</span>可乘坐980路公交车到密云，然后换乘当地班车
            </span>
          </p>
        </div>
      </section>

      {/* 周边餐饮与购物推荐 */}
      <section id="attraction-nearby" className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">周边推荐</h2>
        <div className="space-y-6">
          {/* 周边餐饮 */}
          <div id="nearby-food">
            <h3 className="text-lg font-medium text-text-primary flex items-center mb-3">
              <i className="fas fa-utensils text-accent mr-2"></i>
              餐饮推荐
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((restaurant) => (
                <Link 
                  key={restaurant.id}
                  to={`/food-detail?food_id=${restaurant.id}`} 
                  className={`flex bg-bg-light rounded-lg overflow-hidden ${styles.cardHover}`}
                >
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={restaurant.image.src} 
                      alt={restaurant.image.alt} 
                      data-category={restaurant.image.category} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-text-primary">{restaurant.name}</h4>
                    <p className="text-xs text-text-secondary mb-1">{restaurant.description}</p>
                    <div className="flex items-center text-xs">
                      <span className="text-amber-500 flex items-center">
                        <i className="fas fa-star mr-1"></i>
                        <span>{restaurant.rating}</span>
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-text-secondary">{restaurant.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* 周边购物 */}
          <div id="nearby-shopping">
            <h3 className="text-lg font-medium text-text-primary flex items-center mb-3">
              <i className="fas fa-shopping-bag text-accent mr-2"></i>
              购物推荐
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shoppingPlaces.map((shop, index) => (
                <div key={index} id={`shopping-card-${index + 1}`} className="flex bg-bg-light rounded-lg overflow-hidden">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={shop.image.src} 
                      alt={shop.image.alt} 
                      data-category={shop.image.category} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-text-primary">{shop.name}</h4>
                    <p className="text-xs text-text-secondary mb-1">{shop.description}</p>
                    <div className="flex items-center text-xs">
                      <span className="text-text-secondary">{shop.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 游客评价 */}
      <section id="attraction-reviews" className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center justify-between">
          <span>游客评价</span>
          <span className="text-accent flex items-center">
            <i className="fas fa-star mr-1"></i>
            <span>4.8</span>
            <span className="text-text-secondary text-sm ml-1">(2,345条评价)</span>
          </span>
        </h2>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              id={`review-${index + 1}`} 
              className={index < reviews.length - 1 ? "border-b border-gray-100 pb-4" : ""}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                  <span>{review.initial}</span>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{review.author}</h4>
                  <div className="flex items-center text-xs text-amber-500">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    {review.rating % 1 !== 0 && (
                      <i className="fas fa-star-half-alt"></i>
                    )}
                    {[...Array(5 - Math.ceil(review.rating))].map((_, i) => (
                      <i key={i} className="far fa-star"></i>
                    ))}
                    <span className="text-text-secondary ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-text-secondary text-sm">{review.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AttractionContent;