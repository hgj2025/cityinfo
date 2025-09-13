
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles.module.css';

const MobileSearch = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search-result?keyword=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div id="mobile-search" className="md:hidden bg-white shadow-sm pt-16 px-4 py-3">
      <div className="relative">
        <input 
          type="text" 
          placeholder="搜索城市、景点、美食..." 
          className={`search-input w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:border-accent focus:outline-none ${styles['search-input']}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent"
          onClick={handleSearch}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default MobileSearch;