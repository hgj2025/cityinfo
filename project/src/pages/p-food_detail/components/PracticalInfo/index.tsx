
const PracticalInfo: React.FC = () => {
  return (
    <section id="practical-info" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-text-primary">实用信息</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div id="business-hours" className="flex">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mr-3">
              <i className="far fa-clock"></i>
            </div>
            <div>
              <h3 className="text-text-primary font-medium text-sm">营业时间</h3>
              <p className="text-text-secondary text-sm">周一至周日 06:30-21:00</p>
            </div>
          </div>
          <div id="reservation-method" className="flex">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mr-3">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div>
              <h3 className="text-text-primary font-medium text-sm">预订方式</h3>
              <p className="text-text-secondary text-sm">电话：025-86612345</p>
            </div>
          </div>
          <div id="payment-method" className="flex">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mr-3">
              <i className="fas fa-credit-card"></i>
            </div>
            <div>
              <h3 className="text-text-primary font-medium text-sm">支付方式</h3>
              <p className="text-text-secondary text-sm">现金、微信、支付宝</p>
            </div>
          </div>
          <div id="best-time" className="flex">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mr-3">
              <i className="far fa-calendar-alt"></i>
            </div>
            <div>
              <h3 className="text-text-primary font-medium text-sm">最佳用餐时间</h3>
              <p className="text-text-secondary text-sm">早餐 07:00-09:00，人流较少</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticalInfo;