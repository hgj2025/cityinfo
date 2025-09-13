
import { useState } from 'react';
import { CollectionItem as CollectionItemType } from '../../types';
import CollectionItem from '../CollectionItem';

interface CollectionsContentProps {
  collections: CollectionItemType[];
  onDeleteCollection: (id: string) => void;
}

const CollectionsContent: React.FC<CollectionsContentProps> = ({ collections, onDeleteCollection }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // Filter collections based on selected type
  const filteredCollections = collections.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  // Sort collections based on selected order
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    const dateA = new Date(a.collectionDate).getTime();
    const dateB = new Date(b.collectionDate).getTime();
    return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollections = sortedCollections.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div id="collections-content" className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">我的收藏</h2>
        <div id="collection-filter" className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">筛选：</span>
          <select 
            id="collection-type-filter" 
            className="text-sm border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:border-accent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">全部</option>
            <option value="city">城市</option>
            <option value="attraction">景点</option>
            <option value="food">美食</option>
            <option value="accommodation">住宿</option>
          </select>
          <select 
            id="collection-sort" 
            className="text-sm border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:border-accent"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="recent">最近收藏</option>
            <option value="oldest">最早收藏</option>
          </select>
        </div>
      </div>

      {/* 收藏列表 */}
      <div id="collection-list" className="space-y-4">
        {paginatedCollections.length > 0 ? (
          paginatedCollections.map(item => (
            <CollectionItem 
              key={item.id} 
              item={item} 
              onDelete={onDeleteCollection} 
            />
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            没有找到符合条件的收藏项
          </div>
        )}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div id="collection-pagination" className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button 
              id="prev-page" 
              className="px-3 py-1 rounded-md text-text-secondary hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              id="next-page" 
              className="px-3 py-1 rounded-md text-text-secondary hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CollectionsContent;