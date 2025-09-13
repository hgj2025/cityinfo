
import { useState } from 'react';
import { RouteItem } from '../../../types';
import styles from '../../../styles.module.css';

const InterAttractionSection = () => {
  // 路线项目状态
  const [routeItems, setRouteItems] = useState<RouteItem[]>([
    {
      id: 'route-item-1',
      title: '夫子庙 → 中山陵',
      subtitle: '距离约12公里，推荐时间：30-45分钟',
      icon: 'fas fa-map-signs',
      isExpanded: false,
      distance: '12公里',
      time: '30-45分钟'
    },
    {
      id: 'route-item-2',
      title: '总统府 → 夫子庙',
      subtitle: '距离约4公里，推荐时间：15-20分钟',
      icon: 'fas fa-map-signs',
      isExpanded: false,
      distance: '4公里',
      time: '15-20分钟'
    },
    {
      id: 'route-item-3',
      title: '中山陵 → 玄武湖',
      subtitle: '距离约10公里，推荐时间：25-35分钟',
      icon: 'fas fa-map-signs',
      isExpanded: false,
      distance: '10公里',
      time: '25-35分钟'
    }
  ]);

  // 切换展开/折叠状态
  const toggleExpand = (id: string) => {
    setRouteItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, isExpanded: !item.isExpanded } 
          : item
      )
    );
  };

  return (
    <section id="inter-attraction-section" className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <i className="fas fa-route text-accent mr-3"></i>
          景点间交通路线
        </h2>
        
        {/* 夫子庙到中山陵 */}
        <div 
          id="route-item-1" 
          className={`${styles.trafficItem} rounded-lg border border-gray-100 mb-4 ${
            routeItems[0].isExpanded ? styles.expanded : ''
          }`}
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpand('route-item-1')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <i className="fas fa-map-signs text-accent"></i>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">夫子庙 → 中山陵</h3>
                <p className="text-sm text-text-secondary">距离约12公里，推荐时间：30-45分钟</p>
              </div>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
              routeItems[0].isExpanded ? 'rotate-180' : ''
            }`}></i>
          </div>
          <div className={`${styles.trafficContent} px-4 pb-4 ${
            routeItems[0].isExpanded ? styles.expanded : ''
          }`}>
            <div className="pl-12 space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-bus text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">公交路线</h4>
                  <p className="text-sm text-text-secondary">方案1：在夫子庙站乘坐游5路公交车，直达中山陵，全程约40分钟，票价2元。</p>
                  <p className="text-sm text-text-secondary">方案2：乘坐地铁1号线到新街口站，换乘地铁2号线到苜蓿园站，再换乘游2路公交车到中山陵，全程约50分钟。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-taxi text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">出租车/网约车</h4>
                  <p className="text-sm text-text-secondary">直接乘坐出租车约30分钟，费用约40-50元。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 总统府到夫子庙 */}
        <div 
          id="route-item-2" 
          className={`${styles.trafficItem} rounded-lg border border-gray-100 mb-4 ${
            routeItems[1].isExpanded ? styles.expanded : ''
          }`}
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpand('route-item-2')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <i className="fas fa-map-signs text-accent"></i>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">总统府 → 夫子庙</h3>
                <p className="text-sm text-text-secondary">距离约4公里，推荐时间：15-20分钟</p>
              </div>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
              routeItems[1].isExpanded ? 'rotate-180' : ''
            }`}></i>
          </div>
          <div className={`${styles.trafficContent} px-4 pb-4 ${
            routeItems[1].isExpanded ? styles.expanded : ''
          }`}>
            <div className="pl-12 space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-subway text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">地铁</h4>
                  <p className="text-sm text-text-secondary">从大行宫站乘坐地铁2号线到大行宫站，换乘地铁3号线到夫子庙站，全程约15分钟，票价2元。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-bus text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">公交</h4>
                  <p className="text-sm text-text-secondary">乘坐44路公交车，从总统府站到夫子庙站，全程约20分钟，票价2元。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-walking text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">步行</h4>
                  <p className="text-sm text-text-secondary">沿中山南路步行约30分钟可到达，沿途可欣赏南京老城区风貌。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 中山陵到玄武湖 */}
        <div 
          id="route-item-3" 
          className={`${styles.trafficItem} rounded-lg border border-gray-100 ${
            routeItems[2].isExpanded ? styles.expanded : ''
          }`}
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpand('route-item-3')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <i className="fas fa-map-signs text-accent"></i>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">中山陵 → 玄武湖</h3>
                <p className="text-sm text-text-secondary">距离约10公里，推荐时间：25-35分钟</p>
              </div>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
              routeItems[2].isExpanded ? 'rotate-180' : ''
            }`}></i>
          </div>
          <div className={`${styles.trafficContent} px-4 pb-4 ${
            routeItems[2].isExpanded ? styles.expanded : ''
          }`}>
            <div className="pl-12 space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-bus text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">公交路线</h4>
                  <p className="text-sm text-text-secondary">乘坐游2路公交车到苜蓿园站，换乘地铁2号线到鼓楼站，步行约5分钟到玄武湖，全程约45分钟。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                  <i className="fas fa-taxi text-primary text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">出租车/网约车</h4>
                  <p className="text-sm text-text-secondary">直接乘坐出租车约25分钟，费用约35-45元。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterAttractionSection;
