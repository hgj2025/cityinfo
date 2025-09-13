
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="main-footer" className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div id="footer-about">
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-white/80 text-sm">锦绣中华行致力于为用户提供全面、系统的中国城市深度旅游信息，帮助用户沉浸式体验中国文化，高效规划旅行。</p>
          </div>
          <div id="footer-links">
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/home" className="text-white/80 hover:text-white">首页</Link></li>
              <li><Link to="/map-view" className="text-white/80 hover:text-white">地图浏览</Link></li>
              <li><Link to="/collection-my" className="text-white/80 hover:text-white">我的收藏</Link></li>
            </ul>
          </div>
          <div id="footer-contact">
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-white/80">
                <i className="fas fa-envelope mr-2"></i>
                <span>contact@jinxiuzhonghua.com</span>
              </li>
              <li className="flex items-center text-white/80">
                <i className="fas fa-phone mr-2"></i>
                <span>+86 123 4567 8910</span>
              </li>
            </ul>
          </div>
          <div id="footer-social">
            <h3 className="text-lg font-semibold mb-4">关注我们</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                <i className="fab fa-weixin"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                <i className="fab fa-weibo"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/60">
          <p>© 2023 锦绣中华行 版权所有</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;