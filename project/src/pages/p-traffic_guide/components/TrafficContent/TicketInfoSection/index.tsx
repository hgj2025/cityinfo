
const TicketInfoSection = () => {
  return (
    <section id="ticket-info-section" className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <i className="fas fa-ticket-alt text-accent mr-3"></i>
          交通卡/票务信息
        </h2>
        
        <div className="space-y-4">
          <div id="traffic-card-info" className="flex">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
              <i className="fas fa-credit-card text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-2">南京市民卡/交通卡</h3>
              <p className="text-text-secondary mb-2">南京市民卡可用于地铁、公交等公共交通，享受9折优惠。游客可在各地铁站售票处购买普通交通卡（押金20元），离开时可退卡退押金。</p>
              <p className="text-text-secondary">购买地点：各地铁站售票处、南京市民卡服务网点</p>
            </div>
          </div>
          
          <div id="day-pass-info" className="flex">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
              <i className="fas fa-calendar-day text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-2">旅游日票</h3>
              <p className="text-text-secondary mb-2">南京推出旅游日票，20元/张，当日内可无限次乘坐地铁和公交，适合一日游的游客。</p>
              <p className="text-text-secondary">购买地点：南京主要地铁站、旅游集散中心、部分酒店</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketInfoSection;
