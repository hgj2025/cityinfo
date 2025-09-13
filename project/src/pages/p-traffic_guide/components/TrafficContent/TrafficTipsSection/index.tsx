
const TrafficTipsSection = () => {
  return (
    <section id="traffic-tips-section" className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <i className="fas fa-lightbulb text-accent mr-3"></i>
          交通贴士
        </h2>
        
        <div className="bg-accent/5 rounded-lg p-4 space-y-3">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-accent mt-1 mr-3"></i>
            <p className="text-text-secondary">南京地铁早晚高峰期（7:00-9:00, 17:00-19:00）较为拥挤，建议错峰出行。</p>
          </div>
          <div className="flex items-start">
            <i className="fas fa-info-circle text-accent mt-1 mr-3"></i>
            <p className="text-text-secondary">紫金山景区（中山陵、明孝陵等）面积较大，内部有观光车，单程票价5元，往返票价8元。</p>
          </div>
          <div className="flex items-start">
            <i className="fas fa-info-circle text-accent mt-1 mr-3"></i>
            <p className="text-text-secondary">夏季（6-8月）南京天气炎热，出行请做好防暑准备，尽量避开中午高温时段。</p>
          </div>
          <div className="flex items-start">
            <i className="fas fa-info-circle text-accent mt-1 mr-3"></i>
            <p className="text-text-secondary">下载"南京地铁"、"南京公交"APP可实时查询线路和到站信息，非常便利。</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficTipsSection;
