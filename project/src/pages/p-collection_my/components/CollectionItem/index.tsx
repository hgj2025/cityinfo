
import { useNavigate } from 'react-router-dom';
import { CollectionItem as CollectionItemType } from '../../types';
import styles from '../../styles.module.css';

interface CollectionItemProps {
  item: CollectionItemType;
  onDelete: (id: string) => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ item, onDelete }) => {
  const navigate = useNavigate();
  
  const handleView = () => {
    switch (item.type) {
      case 'city':
        navigate(`/city-detail?city_id=${item.id}`);
        break;
      case 'attraction':
        navigate(`/attraction-detail?attraction_id=${item.id}`);
        break;
      case 'food':
        navigate(`/food-detail?food_id=${item.id}`);
        break;
      case 'accommodation':
        navigate(`/accommodation-detail?accommodation_id=${item.id}`);
        break;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'city':
        return { text: '城市', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'attraction':
        return { text: '景点', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'food':
        return { text: '美食', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      case 'accommodation':
        return { text: '住宿', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
      default:
        return { text: '未知', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  const typeLabel = getTypeLabel();

  return (
    <div id={`collection-item-${item.id}`} className={`flex flex-col sm:flex-row bg-gray-50 rounded-lg overflow-hidden ${styles.cardHover}`}>
      <div className="sm:w-32 h-24 sm:h-auto overflow-hidden">
        <img src={item.imageUrl} alt={item.title} data-category={typeLabel.text} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`inline-block ${typeLabel.bgColor} ${typeLabel.textColor} text-xs px-2 py-1 rounded-full mr-2`}>
              {typeLabel.text}
            </span>
            <h3 className="font-medium text-text-primary">{item.title}</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3 sm:mb-0">{item.description}</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end sm:w-48">
          <span className="text-xs text-text-secondary">收藏于 {item.collectionDate}</span>
          <div className="flex space-x-2 ml-4">
            <button 
              className="text-accent hover:text-accent/80" 
              title="查看详情"
              onClick={handleView}
            >
              <i className="fas fa-eye"></i>
            </button>
            <button 
              className="text-red-500 hover:text-red-600" 
              title="取消收藏"
              onClick={() => onDelete(item.id)}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;