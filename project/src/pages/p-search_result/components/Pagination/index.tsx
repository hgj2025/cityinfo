
import { useState } from 'react';

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // In a real app, this would trigger loading of the new page data
      window.scrollTo(0, 0);
    }
  };

  return (
    <section id="pagination" className="flex justify-center">
      <div className="inline-flex rounded-md shadow-sm">
        <button 
          id="prev-page" 
          className="px-4 py-2 text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left mr-1"></i> 上一页
        </button>
        
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            id={`page-${page}`}
            className={`px-4 py-2 text-sm font-medium ${
              currentPage === page
                ? 'text-white bg-primary border border-primary'
                : 'text-text-secondary bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button 
          id="next-page" 
          className="px-4 py-2 text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页 <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </section>
  );
};

export default Pagination;