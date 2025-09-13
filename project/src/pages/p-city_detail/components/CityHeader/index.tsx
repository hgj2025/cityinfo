
import { useState } from 'react';
import { CityData } from '../../types';

interface CityHeaderProps {
  cityData: CityData;
  onShare: () => void;
}

const CityHeader: React.FC<CityHeaderProps> = ({ cityData, onShare }) => {
  const [isCollected, setIsCollected] = useState(false);

  const handleCollect = () => {
    setIsCollected(prev => !prev);
    if (!isCollected) {
      alert('收藏成功');
    } else {
      alert('已取消收藏');
    }
  };

  return (
    <section id="city-header" className="mb-8">
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
        <img 
          src={cityData.imageUrl} 
          alt={cityData.name} 
          data-category="城市" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <h1 id="city-name-header" className="text-white text-3xl md:text-4xl font-bold mb-2">{cityData.name}</h1>
                <p id="city-slogan" className="text-white/90 text-sm md:text-base">{cityData.slogan}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  id="share-button" 
                  className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  onClick={onShare}
                >
                  <i className="fas fa-share-alt"></i>
                </button>
                <button 
                  id="collect-button" 
                  className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  onClick={handleCollect}
                >
                  <i className={isCollected ? "fas fa-heart" : "far fa-heart"}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityHeader;