
import { useState, useRef, useEffect } from 'react';
import styles from '../../styles.module.css';
import { SlideImage } from '../../types';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const imageSliderRef = useRef<HTMLDivElement>(null);
  
  const slides: SlideImage[] = [
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      alt: "酒店外观",
      category: "建筑"
    },
    {
      src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      alt: "酒店大堂",
      category: "室内"
    },
    {
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      alt: "酒店客房",
      category: "室内"
    },
    {
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      alt: "酒店餐厅",
      category: "室内"
    }
  ];

  const goToSlide = (index: number) => {
    let targetIndex = index;
    if (targetIndex < 0) targetIndex = slides.length - 1;
    if (targetIndex >= slides.length) targetIndex = 0;
    
    if (imageSliderRef.current) {
      imageSliderRef.current.scrollTo({
        left: imageSliderRef.current.clientWidth * targetIndex,
        behavior: 'smooth'
      });
    }
    
    setCurrentSlide(targetIndex);
  };

  const handlePrevClick = () => {
    goToSlide(currentSlide - 1);
  };

  const handleNextClick = () => {
    goToSlide(currentSlide + 1);
  };

  // 监听滚动事件，更新当前幻灯片索引
  useEffect(() => {
    const handleScroll = () => {
      if (imageSliderRef.current) {
        const scrollPosition = imageSliderRef.current.scrollLeft;
        const slideWidth = imageSliderRef.current.clientWidth;
        const newIndex = Math.round(scrollPosition / slideWidth);
        
        if (newIndex !== currentSlide) {
          setCurrentSlide(newIndex);
        }
      }
    };

    const sliderElement = imageSliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentSlide]);

  return (
    <div id="image-slider-container" className="relative h-64 md:h-80">
      <div 
        id="image-slider" 
        ref={imageSliderRef}
        className={`${styles.imageSlider} flex overflow-x-auto h-full`}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img 
              src={slide.src} 
              alt={slide.alt} 
              data-category={slide.category} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* 轮播控制按钮 */}
      <button 
        id="prev-slide" 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
        onClick={handlePrevClick}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button 
        id="next-slide" 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
        onClick={handleNextClick}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
      
      {/* 轮播指示器 */}
      <div id="slider-indicators" className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            data-index={index} 
            className={`w-2 h-2 rounded-full bg-white ${index === currentSlide ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;