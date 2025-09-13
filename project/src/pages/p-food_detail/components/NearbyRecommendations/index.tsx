
import { Link } from 'react-router-dom';
import { NearbyItem } from '../../types';

interface NearbyRecommendationsProps {
  items: NearbyItem[];
}

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({ items }) => {
  return (
    <section id="nearby-recommendations" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-text-primary">周边推荐</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div id={`nearby-${item.type}-${item.id}`} key={item.id} className="flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  data-category={item.type} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-text-primary font-medium">{item.name}</h3>
                <p className="text-text-secondary text-xs mb-1">{item.type} · {item.distance}</p>
                {item.link ? (
                  <Link to={item.link} className="text-accent text-xs hover:underline">查看详情</Link>
                ) : (
                  <a href="#" className="text-accent text-xs hover:underline">查看详情</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyRecommendations;