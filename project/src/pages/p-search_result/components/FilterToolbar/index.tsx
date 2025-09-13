
import { FilterType } from '../../types';
import styles from '../../styles.module.css';

interface FilterToolbarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterToolbar = ({ activeFilter, onFilterChange }: FilterToolbarProps) => {
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'city', label: '城市' },
    { id: 'attraction', label: '景点' },
    { id: 'food', label: '美食' },
    { id: 'accommodation', label: '住宿' }
  ];

  return (
    <section id="filter-toolbar" className="bg-white rounded-xl shadow-card p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            id={`filter-${filter.id}`}
            className={`${
              activeFilter === filter.id ? styles.filterButton + ' active' : ''
            } px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-primary hover:text-white transition-colors`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default FilterToolbar;