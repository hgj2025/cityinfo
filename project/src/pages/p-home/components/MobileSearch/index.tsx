
import styles from '../../styles.module.css';

const MobileSearch = () => {
  const handleSearch = () => {
    const searchInput = document.getElementById('mobile-search-input') as HTMLInputElement;
    const keyword = searchInput.value.trim();
    if (keyword) {
      window.location.href = `/search-result?keyword=${encodeURIComponent(keyword)}`;
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
          id="mobile-search-input" 
          placeholder="搜索城市、景点、美食..." 
          className={`${styles['search-input']} w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:border-accent focus:outline-none`}
          onKeyPress={handleKeyPress}
        />
        <button 
          id="mobile-search-button" 
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