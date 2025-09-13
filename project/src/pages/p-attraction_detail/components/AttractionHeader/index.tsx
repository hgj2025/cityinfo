
import { useState } from 'react';
import styles from '../../styles.module.css';

interface AttractionHeaderProps {
  onShareClick: () => void;
}

const AttractionHeader: React.FC<AttractionHeaderProps> = ({ onShareClick }) => {
  const [isCollected, setIsCollected] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  const imageUrls = [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
    'https://images.unsplash.com/photo-1467385829985-2b0fb82b5193',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b',
    'https://images.unsplash.com/photo-1508804052814-cd3ba865a116'
  ];

  const handleCollectClick = () => {
    setIsCollected(!isCollected);
    return isCollected;
  };

  return (
    <section id="attraction-header" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div className="relative">
        {/* 大图展示区 */}
        <div id="main-image-container" className="h-64 md:h-80 lg:h-96 overflow-hidden">
          <img 
            id="main-image" 
            src={imageUrls[mainImageIndex]} 
            alt="长城" 
            data-category="景点" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 操作按钮 */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            id="share-button" 
            className="bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-colors"
            onClick={onShareClick}
          >
            <i className="fas fa-share-alt"></i>
          </button>
          <button 
            id="collect-button" 
            className="bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-colors"
            onClick={handleCollectClick}
          >
            <i className={isCollected ? "fas fa-heart text-red-500" : "far fa-heart"}></i>
          </button>
        </div>
      </div>
      
      {/* 缩略图区域 */}
      <div id="thumbnail-container" className="flex p-4 space-x-2 overflow-x-auto">
        {imageUrls.map((url, index) => (
          <div 
            key={index}
            className={`${styles.imageGalleryThumbnail} w-20 h-20 flex-shrink-0 ${mainImageIndex === index ? styles.active : ''}`} 
            data-index={index}
            onClick={() => setMainImageIndex(index)}
          >
            <img 
              src={url} 
              alt={`长城图片 ${index + 1}`} 
              data-category="景点" 
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
      
      {/* 景点标题和类型 */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <h1 id="attraction-title" className="text-2xl md:text-3xl font-bold text-text-primary">长城</h1>
          <span id="attraction-type" className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">历史遗迹</span>
        </div>
        <p id="attraction-brief" className="text-text-secondary">世界文化遗产，中华文明的伟大象征，蜿蜒于崇山峻岭之间</p>
      </div>
    </section>
  );
};

export default AttractionHeader;