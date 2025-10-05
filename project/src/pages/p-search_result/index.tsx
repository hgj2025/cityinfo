
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import MobileSearch from './components/MobileSearch';
import FilterToolbar from './components/FilterToolbar';
import SearchResult from './components/SearchResult';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import { FilterType } from './types';

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState<string>('');
  const [resultCount, setResultCount] = useState<number>(24);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    // Set page title
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 搜索结果';
    
    // Get search keyword from URL
    const searchKeyword = searchParams.get('search_keyword');
    if (searchKeyword) {
      setKeyword(searchKeyword);
    } else {
      setKeyword('南京'); // Default keyword if not provided
    }

    return () => {
      document.title = originalTitle;
    };
  }, [searchParams]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    
    // Update result count based on filter
    let count = 24;
    if (filter !== 'all') {
      // In a real app, this would be based on actual filtered data
      const filterCounts: Record<FilterType, number> = {
        all: 24,
        city: 1,
        attraction: 2,
        food: 2,
        accommodation: 1
      };
      count = filterCounts[filter] || 24;
    }
    
    setResultCount(count);
  };

  const handleSortChange = (sortType: string) => {
    setSortBy(sortType);
    // In a real app, this would trigger re-sorting of results
  };

  return (
    <div className="bg-bg-light min-h-screen">
      <Header />
      <MobileSearch keyword={keyword} />
      
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12">
        {/* Search results header */}
        <section id="search-header" className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 id="search-title" className="text-text-primary text-xl md:text-2xl font-bold mb-2">
                搜索结果: "<span id="search-keyword">{keyword}</span>"
              </h1>
              <p id="search-count" className="text-text-secondary">
                找到 <span id="result-count">{resultCount}</span> 条结果
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-text-secondary text-sm">排序:</span>
                <select 
                  id="sort-select" 
                  className="bg-white border border-gray-300 text-text-primary rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="relevance">相关度</option>
                  <option value="popularity">热门度</option>
                  <option value="rating">评分</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <FilterToolbar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        
        <SearchResult activeFilter={activeFilter} />
        
        <Pagination />
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultPage;