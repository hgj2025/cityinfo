
import { Link } from 'react-router-dom';
import { NearbyItem } from '../../types';

interface RelatedFoodsProps {
  foods: NearbyItem[];
}

const RelatedFoods: React.FC<RelatedFoodsProps> = ({ foods }) => {
  return (
    <section id="related-foods" className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-text-primary">相关美食推荐</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {foods.map((food) => (
            <div id={`related-food-${food.id}`} key={food.id} className="flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                <img 
                  src={food.image} 
                  alt={food.name} 
                  data-category="美食" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-text-primary font-medium">{food.name}</h3>
                <p className="text-text-secondary text-xs mb-1">{food.type} · {food.distance}</p>
                <Link to={food.link} className="text-accent text-xs hover:underline">查看详情</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedFoods;