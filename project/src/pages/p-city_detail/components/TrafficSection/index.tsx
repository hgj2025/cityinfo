
import { Link } from 'react-router-dom';
import { TransportConnection } from '../../types';

interface TrafficSectionProps {
  transportConnections: TransportConnection[];
  cityId: string;
}

const TrafficSection: React.FC<TrafficSectionProps> = ({ transportConnections, cityId }) => {
  return (
    <section id="traffic" className="mb-12">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <i className="fas fa-bus text-accent mr-2"></i>交通
        </h2>
        
        <div className="space-y-8">
          {/* 机场/火车站交通 */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">机场/火车站交通</h3>
            <div className="space-y-4">
              {transportConnections.map((connection, index) => (
                <div key={index} className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">{connection.from} → {connection.to}</h4>
                  <div className="space-y-2">
                    {connection.routes.map((route, routeIndex) => (
                      <div key={routeIndex} className="flex items-start">
                        <div className="w-24 flex-shrink-0 text-text-secondary font-medium">{route.type}</div>
                        <div className="flex-1 text-text-secondary text-sm">
                          <p>票价：{route.price}</p>
                          <p>时间：{route.time}</p>
                          <p>路线：{route.route}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 景点间交通路线 */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">景点间交通路线</h3>
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">夫子庙 → 中山陵</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">地铁</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：夫子庙站乘坐地铁3号线至鸡鸣寺站，换乘5号线至中山陵站，再步行或乘坐景区观光车前往中山陵</p>
                      <p>时间：约60分钟</p>
                      <p>票价：地铁约¥5/人，景区观光车另计</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">公交</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：夫子庙乘坐游5路公交车直达中山陵</p>
                      <p>时间：约50分钟</p>
                      <p>票价：约¥2/人</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">出租车</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：直达</p>
                      <p>时间：约30分钟</p>
                      <p>票价：约¥40-50</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">总统府 → 夫子庙</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">地铁</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：大行宫站乘坐地铁2号线至莫愁湖站，换乘3号线至夫子庙站</p>
                      <p>时间：约25分钟</p>
                      <p>票价：约¥4/人</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">公交</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：总统府附近乘坐7路、40路等公交车至夫子庙站</p>
                      <p>时间：约30分钟</p>
                      <p>票价：约¥2/人</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">步行</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：沿中山南路向南步行约2公里</p>
                      <p>时间：约30分钟</p>
                      <p>票价：免费</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">玄武湖 → 明城墙</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-text-secondary font-medium">步行</div>
                    <div className="flex-1 text-text-secondary text-sm">
                      <p>路线：玄武湖公园东门出口即可到达明城墙玄武门段，可登城墙游览</p>
                      <p>时间：约5分钟</p>
                      <p>票价：免费（登城墙需购票）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 市内交通概览 */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">市内交通概览</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <i className="fas fa-subway mr-2"></i>地铁
                </h4>
                <p className="text-text-secondary text-sm">南京地铁共有10条线路，覆盖市区主要区域和景点。运营时间通常为6:00-23:00，票价根据距离2-9元不等。建议购买交通卡或使用手机支付，更加便捷。</p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <i className="fas fa-bus mr-2"></i>公交
                </h4>
                <p className="text-text-secondary text-sm">南京公交线路众多，基本覆盖全市各个角落。普通公交车票价1-2元，空调车2-3元。可使用交通卡或手机支付，现金需准备零钱。</p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <i className="fas fa-taxi mr-2"></i>出租车/网约车
                </h4>
                <p className="text-text-secondary text-sm">出租车起步价14元（3公里），之后每公里2.5元。网约车（滴滴、曹操等）价格略低于出租车，高峰期可能有溢价。建议使用手机APP预约，更加便捷。</p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <i className="fas fa-bicycle mr-2"></i>共享单车
                </h4>
                <p className="text-text-secondary text-sm">南京市区内有哈啰、青桔等多种共享单车可供使用，通过手机APP扫码即可骑行。适合短距离出行，费用通常为每30分钟1.5-2元。</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to={`/traffic-guide?city_id=${cityId}`} 
            id="more-traffic-button" 
            className="inline-flex items-center text-accent hover:text-accent/80"
          >
            <span>查看完整交通指南</span>
            <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrafficSection;