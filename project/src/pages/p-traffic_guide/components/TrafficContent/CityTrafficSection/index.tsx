
const CityTrafficSection = () => {

  const handleMetroMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('地铁线路图将在新窗口打开');
  };

  return (
    <section id="city-traffic-section" className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <i className="fas fa-city text-accent mr-3"></i>
          市内交通概览
        </h2>
        
        <div className="space-y-6">
          {/* 地铁 */}
          <div id="metro-overview" className="flex">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 mt-1">
              <i className="fas fa-subway text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary text-lg mb-2">地铁</h3>
              <p className="text-text-secondary mb-3">南京地铁共有10条线路，覆盖市区主要区域和景点。运营时间通常为早6:00至晚23:00，票价2-9元不等，根据里程计费。</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">主要地铁线路</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">1</span>
                    <span>1号线：迈皋桥 - 中国药科大学，经过新街口、南京站等</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center mr-2">2</span>
                    <span>2号线：油坊桥 - 经天路，经过玄武湖、鼓楼、新街口等</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center mr-2">3</span>
                    <span>3号线：林场 - 南京南站，经过夫子庙、大行宫等</span>
                  </li>
                </ul>
                <div className="mt-3">
                  <a 
                    href="#" 
                    id="metro-map-link" 
                    className="text-accent hover:text-accent/80 flex items-center text-sm"
                    onClick={handleMetroMapClick}
                  >
                    <i className="fas fa-map mr-1"></i>
                    <span>查看地铁线路图</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* 公交 */}
          <div id="bus-overview" className="flex">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 mt-1">
              <i className="fas fa-bus text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary text-lg mb-2">公交</h3>
              <p className="text-text-secondary mb-3">南京公交线路众多，覆盖面广，基本票价1-2元。旅游专线（游1-游9路）连接各主要景点，非常适合游客使用。</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">旅游专线推荐</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><span className="font-medium">游1路</span>：南京站 - 中山陵，途经玄武湖、明孝陵等</li>
                  <li><span className="font-medium">游2路</span>：南京站 - 明孝陵，途经紫金山、中山陵等</li>
                  <li><span className="font-medium">游3路</span>：南京站 - 雨花台，途经总统府、夫子庙等</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 出租车/网约车 */}
          <div id="taxi-overview" className="flex">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 mt-1">
              <i className="fas fa-taxi text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary text-lg mb-2">出租车/网约车</h3>
              <p className="text-text-secondary mb-3">出租车起步价14元（3公里），之后每公里2.4元。晚上23:00-次日5:00加收20%夜间费。网约车价格通常比出租车便宜10-20%。</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">叫车方式</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start">
                    <i className="fas fa-mobile-alt text-accent mt-0.5 mr-2"></i>
                    <span>滴滴出行、高德打车等APP可在南京叫到网约车</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-phone text-accent mt-0.5 mr-2"></i>
                    <span>出租车电话叫车：96520（南京市出租汽车管理处）</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 共享单车 */}
          <div id="bike-overview" className="flex">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 mt-1">
              <i className="fas fa-bicycle text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary text-lg mb-2">共享单车</h3>
              <p className="text-text-secondary mb-3">南京市区内共享单车覆盖广泛，包括哈啰、美团等品牌，通过手机APP扫码即可使用，费用约1.5元/30分钟。适合短距离出行和景区内游览。</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-text-secondary">
                <p>注意：部分景区和商业区设有共享单车禁停区，请遵守相关规定，避免违规停放。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityTrafficSection;
