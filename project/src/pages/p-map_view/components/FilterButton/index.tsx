
import { FilterButtonProps } from '../../types';

const FilterButton = ({ id, label, isActive, onClick }: FilterButtonProps) => {
  return (
    <button 
      id={`filter-${id}`} 
      className={`px-3 py-1 rounded-full text-sm ${
        isActive 
          ? 'bg-accent text-white' 
          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
      }`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
};

export default FilterButton;