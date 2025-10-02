
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { cityService, CityOverview } from '../../../../services/city';

const OverviewSection: React.FC = () => {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const cityId = pathId || searchParams.get('city_id') || 'nanjing';
  
  const [overview, setOverview] = useState<CityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取城市概览数据
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const data = await cityService.getCityOverview(cityId);
        setOverview(data);
        setError(null);
      } catch (err) {
        setError('获取城市概览信息失败');
        console.error('获取城市概览信息失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [cityId]);

  if (loading) {
    return (
      <section id="overview" className="mb-12">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !overview) {
    return (
      <section id="overview" className="mb-12">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">
              <i className="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <p className="text-text-secondary">{error || '暂无概览信息'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="overview" className="mb-12">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <i className="fas fa-info-circle text-accent mr-2"></i>{overview.city.name}概览
        </h2>
        
        {/* 历史沿革 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">{overview.history.title}</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              {overview.history.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-text-secondary mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="md:w-1/3">
              <img 
                src={overview.history.image || "https://images.unsplash.com/photo-1555921015-5532091f6026"} 
                alt={`${overview.city.name}历史`} 
                data-category="历史" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* 文化特色 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">{overview.culture.title}</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={overview.culture.image || "https://images.unsplash.com/photo-1555921015-5532091f6026"} 
                alt={`${overview.city.name}文化`} 
                data-category="文化" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              {overview.culture.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-text-secondary mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* 风俗习惯 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">{overview.customs.title}</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              {overview.customs.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-text-secondary mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="md:w-1/3">
              <img 
                src={overview.customs.image || "https://images.unsplash.com/photo-1528825871115-3581a5387919"} 
                alt={`${overview.city.name}风俗`} 
                data-category="文化" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* 艺术与非遗 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">艺术与非物质文化遗产</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {overview.heritageItems.map((item, index) => (
              <div key={index}>
                <div className="bg-primary/5 rounded-lg p-4 h-full">
                  <h4 className="font-medium text-primary mb-2">{item.name}</h4>
                  <p className="text-text-secondary text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 节庆活动 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">节庆活动</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-primary/5">
                  <th className="py-3 px-4 text-left text-text-primary font-medium">节庆名称</th>
                  <th className="py-3 px-4 text-left text-text-primary font-medium">举办时间</th>
                  <th className="py-3 px-4 text-left text-text-primary font-medium">主要活动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overview.festivals.map((festival, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-text-secondary">{festival.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{festival.time}</td>
                    <td className="py-3 px-4 text-text-secondary">{festival.activities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 名人与历史故事 */}
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-3">名人与历史故事</h3>
          <div className="space-y-4">
            {overview.historicalStories.map((story, index) => (
              <div key={index} className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">{story.title}</h4>
                <p className="text-text-secondary text-sm">{story.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;