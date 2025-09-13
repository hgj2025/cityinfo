
import { useState } from 'react';
import { Review } from '../../types';
import styles from '../../styles.module.css';

interface UserReviewsProps {
  reviews: Review[];
}

const UserReviews: React.FC<UserReviewsProps> = ({ reviews }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [noMoreReviews, setNoMoreReviews] = useState(false);

  const handleLoadMoreReviews = () => {
    setIsLoading(true);
    console.log('加载更多评价');
    
    // 模拟加载更多评价
    setTimeout(() => {
      setIsLoading(false);
      setNoMoreReviews(true);
    }, 1000);
  };

  const handleWriteReview = () => {
    // 在实际应用中，这里会显示评价表单
    console.log('显示评价表单');
    alert('请登录后发表评价');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className={`fas fa-star ${styles.star} ${styles.filled}`}></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className={`fas fa-star-half-alt ${styles.star} ${styles.filled}`}></i>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className={`far fa-star ${styles.star}`}></i>);
    }
    
    return stars;
  };

  return (
    <section id="user-reviews" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary">用户评价</h2>
        <button 
          id="write-review-button" 
          className="text-accent hover:text-accent/80 text-sm flex items-center"
          onClick={handleWriteReview}
        >
          <i className="fas fa-pencil-alt mr-1"></i>
          <span>写评价</span>
        </button>
      </div>
      <div className="p-4">
        {reviews.map((review, index) => (
          <div 
            id={`review-${review.id}`} 
            key={review.id} 
            className={`${index < reviews.length - 1 ? 'border-b border-gray-100 pb-4 mb-4' : ''}`}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                <i className="fas fa-user"></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-text-primary font-medium">{review.userName}</h3>
                  <span className="text-text-secondary text-xs">{review.date}</span>
                </div>
                <div className={`${styles.starRating} mb-2`}>
                  {renderStars(review.rating)}
                </div>
                <p className="text-text-secondary text-sm">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* 查看更多评价 */}
        <div className="text-center mt-4">
          <button 
            id="more-reviews-button" 
            className="text-accent hover:text-accent/80 text-sm"
            onClick={handleLoadMoreReviews}
            disabled={isLoading || noMoreReviews}
          >
            {isLoading ? '加载中...' : noMoreReviews ? '没有更多评价了' : '查看更多评价 '}
            {!isLoading && !noMoreReviews && <i className="fas fa-chevron-down ml-1"></i>}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserReviews;