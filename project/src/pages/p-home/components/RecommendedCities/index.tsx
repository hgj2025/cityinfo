
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cityService, type City } from '../../../../services';
import styles from '../../styles.module.css';

const RecommendedCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await cityService.getCities({ limit: 4 });
        setCities(response.data.items);
        setError(null);
      } catch (err) {
        setError('获取推荐城市失败');
        console.error('获取推荐城市失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <section id="recommended-cities" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-primary text-xl md:text-2xl font-bold">推荐城市</h2>
        </div>
        <div className="text-center py-8">正在加载推荐城市...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="recommended-cities" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-primary text-xl md:text-2xl font-bold">推荐城市</h2>
        </div>
        <div className="text-center text-red-600 py-8">{error}</div>
      </section>
    );
  }

  return (
    <section id="recommended-cities" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary text-xl md:text-2xl font-bold">推荐城市</h2>
        <Link to="/cities" className="text-accent hover:text-accent/80 flex items-center text-sm">
          <span>查看全部</span>
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cities.map((city) => (
          <Link
            key={city.id}
            to={`/city-detail/${city.id}`}
            id={`city-card-${city.id}`}
            className={`bg-white rounded-xl shadow-card overflow-hidden ${styles['card-hover']}`}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={city.image || '/placeholder-city.jpg'}
                alt={city.name}
                data-category="城市"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=' + encodeURIComponent(city.name);
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-text-primary font-semibold text-lg mb-1">{city.name}</h3>
              <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                {city.description}
              </p>
              <div className="flex items-center text-xs text-text-secondary">
                <span className="flex items-center mr-3">
                  <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                  <span>{city.location}</span>
                </span>
                <span className="flex items-center">
                  <i className="fas fa-star text-accent mr-1"></i>
                  <span>{city.nameEn}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedCities;