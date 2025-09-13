
import styles from '../../styles.module.css';

const MapControls = () => {
  const handleZoomIn = () => {
    console.log('需要调用第三方接口实现地图放大功能');
  };

  const handleZoomOut = () => {
    console.log('需要调用第三方接口实现地图缩小功能');
  };

  const handleResetMap = () => {
    console.log('需要调用第三方接口实现地图重置功能');
  };

  return (
    <div id="map-controls" className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
      <button 
        id="zoom-in" 
        className={styles['map-control-button']}
        onClick={handleZoomIn}
      >
        <i className="fas fa-plus"></i>
      </button>
      <button 
        id="zoom-out" 
        className={styles['map-control-button']}
        onClick={handleZoomOut}
      >
        <i className="fas fa-minus"></i>
      </button>
      <button 
        id="reset-map" 
        className={styles['map-control-button']}
        onClick={handleResetMap}
      >
        <i className="fas fa-home"></i>
      </button>
    </div>
  );
};

export default MapControls;