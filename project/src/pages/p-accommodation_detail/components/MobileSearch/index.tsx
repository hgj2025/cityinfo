
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MobileSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-result?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div id="mobile-search" className="md:hidden bg-white shadow-sm pt-16 px-4 py-3">
      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="搜索城市、景点、美食..." 
          className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:border-accent focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default MobileSearch;