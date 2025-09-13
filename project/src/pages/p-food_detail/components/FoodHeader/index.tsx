
import { useState } from 'react';
import styles from '../../styles.module.css';
import { FoodDetail } from '../../types';

interface FoodHeaderProps {
  food: FoodDetail;
  onShare: () => void;
}

const FoodHeader: React.FC<FoodHeaderProps> = ({ food, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCollected, setIsCollected] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? food.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === food.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCollect = () => {
    setIsCollected(!isCollected);
    if (!isCollected) {
      alert('已添加到收藏');
    } else {
      alert('已取消收藏');
    }
  };

  return (
    <section id="food-header" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div id="food-image-carousel" className="relative h-64 md:h-80">
        <img 
          src={food.images[currentImageIndex]} 
          alt={food.title} 
          data-category="美食" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-end">
            <h1 id="food-title" className="text-white text-2xl md:text-3xl font-bold">{food.title}</h1>
            <div className="flex space-x-2">
              <button 
                id="share-button" 
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                onClick={onShare}
              >
                <i className="fas fa-share-alt"></i>
              </button>
              <button 
                id="collect-button" 
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                onClick={handleCollect}
              >
                <i className={isCollected ? "fas fa-heart" : "far fa-heart"}></i>
              </button>
            </div>
          </div>
        </div>
        {/* 图片轮播控制 */}
        <button 
          id="prev-image" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          onClick={handlePrevImage}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          id="next-image" 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          onClick={handleNextImage}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        {/* 图片指示器 */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
          {food.images.map((_, index) => (
            <span 
              key={index} 
              className={`w-2 h-2 rounded-full bg-white ${index === currentImageIndex ? 'opacity-100' : 'opacity-50'}`}
            ></span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div id="food-rating" className="flex items-center">
            <div className={`${styles.starRating} mr-2`}>
              <i className={`fas fa-star ${styles.star} ${styles.filled}`}></i>
              <i className={`fas fa-star ${styles.star} ${styles.filled}`}></i>
              <i className={`fas fa-star ${styles.star} ${styles.filled}`}></i>
              <i className={`fas fa-star ${styles.star} ${styles.filled}`}></i>
              <i className={`fas fa-star-half-alt ${styles.star} ${styles.filled}`}></i>
            </div>
            <span className="text-text-primary font-medium">{food.rating}</span>
            <span className="text-text-secondary text-sm ml-1">({food.reviewCount}条评价)</span>
          </div>
          <div id="food-price" className="flex items-center text-accent">
            <i className="fas fa-yen-sign mr-1"></i>
            <span className="font-medium">{food.price}/人</span>
          </div>
          <div id="food-category" className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
            {food.category}
          </div>
        </div>
        <p id="food-description" className="text-text-secondary mb-4">
          {food.description}
        </p>
        <div id="restaurant-name" className="flex items-center text-text-primary font-medium mb-2">
          <i className="fas fa-store mr-2 text-accent"></i>
          <span>{food.restaurantName}</span>
        </div>
      </div>
    </section>
  );
};

export default FoodHeader;