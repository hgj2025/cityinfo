
import { Dish } from '../../types';

interface SpecialDishesProps {
  dishes: Dish[];
}

const SpecialDishes: React.FC<SpecialDishesProps> = ({ dishes }) => {
  return (
    <section id="special-dishes" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-text-primary">特色菜品</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dishes.map((dish) => (
            <div id={`dish-${dish.id}`} key={dish.id} className="flex">
              <div className="w-20 h-20 rounded-lg overflow-hidden mr-3">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  data-category="美食" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-text-primary font-medium">{dish.name}</h3>
                <p className="text-text-secondary text-sm mb-1">{dish.description}</p>
                <p className="text-accent font-medium">{dish.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialDishes;