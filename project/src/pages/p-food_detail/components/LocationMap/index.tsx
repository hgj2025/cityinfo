
const LocationMap: React.FC = () => {
  const handleNavigate = () => {
    // 在实际应用中，这里会调用地图API进行导航
    console.log('调用地图API进行导航');
    window.open('https://maps.baidu.com', '_blank');
  };

  const handleCopyAddress = () => {
    const address = '江苏省南京市秦淮区贡院街夫子庙步行街内';
    // 在实际应用中，这里会复制地址到剪贴板
    console.log(`复制地址: ${address}`);
    alert('地址已复制到剪贴板');
  };

  return (
    <section id="location-map" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-text-primary">地理位置</h2>
      </div>
      <div className="p-4">
        <div id="address-info" className="flex items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mr-3 flex-shrink-0">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div>
            <h3 className="text-text-primary font-medium text-sm">地址</h3>
            <p className="text-text-secondary text-sm">江苏省南京市秦淮区贡院街夫子庙步行街内</p>
          </div>
        </div>
        <div id="map-container" className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <img 
            src="https://flagcdn.com/w20/cn.png" 
            alt="地图" 
            data-category="地图" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex space-x-2">
          <button 
            id="navigate-button" 
            className="flex-1 bg-accent hover:bg-accent/90 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
            onClick={handleNavigate}
          >
            <i className="fas fa-directions mr-2"></i>
            <span>导航前往</span>
          </button>
          <button 
            id="copy-address-button" 
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors"
            onClick={handleCopyAddress}
          >
            <i className="far fa-copy"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;