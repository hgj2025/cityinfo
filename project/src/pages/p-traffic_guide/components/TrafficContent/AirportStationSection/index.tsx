
import { useState } from 'react';
import { TrafficItem } from '../../../types';
import styles from '../../../styles.module.css';

const AirportStationSection = () => {
  // 交通项目状态
  const [trafficItems, setTrafficItems] = useState<TrafficItem[]>([
    {
      id: 'airport-traffic-item',
      title: '禄口国际机场 → 市区',
      subtitle: '距离市中心约40公里',
      icon: 'fas fa-plane',
      isExpanded: false
    },
    {
      id: 'railway-traffic-item-1',
      title: '南京站(老火车站) → 市区',
      subtitle: '位于市中心，交通便利',
      icon: 'fas fa-train',
      isExpanded: false
    },
    {
      id: 'railway-traffic-item-2',
      title: '南京南站 → 市区',
      subtitle: '高铁站，距市中心约15公里',
      icon: 'fas fa-train',
      isExpanded: false
    }
  ]);

  // 切换展开/折叠状态
  const toggleExpand = (id: string) => {
    setTrafficItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, isExpanded: !item.isExpanded } 
          : item
      )
    );
  };

  return (
    <section id="airport-station-section" className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <i className="fas fa-plane-departure text-accent mr-3"></i>
          机场/火车站交通
        </h2>
        
        {/* 禄口国际机场到市区 */}
        <div 
          id="airport-traffic-item" 
          className={`${styles.trafficItem} rounded-lg border border-gray-100 mb-4 ${
            trafficItems[0].isExpanded ? styles.expanded : ''
          }`}
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpand('airport-traffic-item')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <i className="fas fa-plane text-accent"></i>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">禄口国际机场 → 市区</h3>
                <p className="text-sm text-text-secondary">距离市中心约40公里</p>
              </div>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
              trafficItems[0].isExpanded ? 'rotate-180' : ''
            }`}></i>
          </div>
          <div className={`${styles.trafficContent} px-4 pb-4 ${
            trafficItems[0].isExpanded ? styles.expanded : ''
          }`}>
            <div className="pl-12 space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-subway text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">地铁</h4>
                  <p className="text-sm text-text-secondary">乘坐地铁S1号线，可直达南京南站，全程约35分钟，票价约9元。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-bus text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">机场大巴</h4>
                  <p className="text-sm text-text-secondary">机场1号线：禄口机场 → 中央门长途汽车站，票价20元，运营时间06:00-21:00。</p>
                  <p className="text-sm text-text-secondary">机场2号线：禄口机场 → 南京南站，票价20元，运营时间06:30-21:30。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-taxi text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">出租车/网约车</h4>
                  <p className="text-sm text-text-secondary">从机场到市中心约40公里，出租车费用约150-200元，时间约50分钟。</p>
                  <p className="text-sm text-text-secondary">网约车可能会更经济，约120-150元。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 南京站到市区 */}
        <div 
          id="railway-traffic-item-1" 
          className={`${styles.trafficItem} rounded-lg border border-gray-100 mb-4 ${
            trafficItems[1].isExpanded ? styles.expanded : ''
          }`}
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpand('railway-traffic-item-1')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <i className="fas fa-train text-accent"></i>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">南京站(老火车站) → 市区</h3>
                <p className="text-sm text-text-secondary">位于市中心，交通便利</p>
              </div>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
              trafficItems[1].isExpanded ? 'rotate-180' : ''
            }`}></i>
          </div>
          <div className={`${styles.trafficContent} px-4 pb-4 ${
            trafficItems[1].isExpanded ? styles.expanded : ''
          }`}>
            <div className="pl-12 space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-subway text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">地铁</h4>
                  <p className="text-sm text-text-secondary">站内可换乘地铁1号线和3号线，连接南京主要景点和商圈。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-bus text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">公交</h4>
                  <p className="text-sm text-text-secondary">站前广场有多条公交线路，可前往市内各区域。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 南京南站到市区 */}
        <div 
          id="railway-traffic-item-2" 
          className={`${styles.trafficItem} rounded-lg border border-gray-100 ${
            trafficItems[2].isExpanded ? styles.expanded : ''
          }`}
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpand('railway-traffic-item-2')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <i className="fas fa-train text-accent"></i>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">南京南站 → 市区</h3>
                <p className="text-sm text-text-secondary">高铁站，距市中心约15公里</p>
              </div>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
              trafficItems[2].isExpanded ? 'rotate-180' : ''
            }`}></i>
          </div>
          <div className={`${styles.trafficContent} px-4 pb-4 ${
            trafficItems[2].isExpanded ? styles.expanded : ''
          }`}>
            <div className="pl-12 space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-subway text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">地铁</h4>
                  <p className="text-sm text-text-secondary">站内可换乘地铁1号线、3号线和S1号线，便捷连接市区各地。</p>
                  <p className="text-sm text-text-secondary">乘坐地铁1号线到新街口约25分钟，票价4元。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-taxi text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">出租车/网约车</h4>
                  <p className="text-sm text-text-secondary">从南站到市中心约15公里，出租车费用约40-60元，时间约30分钟。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirportStationSection;