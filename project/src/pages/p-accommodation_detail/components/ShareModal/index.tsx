
import { Link } from 'react-router-dom';
import { ShareModalProps } from '../../types';

const ShareModal = ({ isOpen, onClose, onShare, accommodationId }: ShareModalProps) => {
  if (!isOpen) return null;

  const handleShare = (platform: string) => {
    onShare(platform);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      id="share-modal" 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">分享</h3>
          <button 
            id="close-share-modal" 
            className="text-text-secondary hover:text-text-primary"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            id="share-wechat" 
            className="flex flex-col items-center"
            onClick={() => handleShare('wechat')}
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-2">
              <i className="fab fa-weixin text-xl"></i>
            </div>
            <span className="text-xs text-text-secondary">微信</span>
          </button>
          <button 
            id="share-weibo" 
            className="flex flex-col items-center"
            onClick={() => handleShare('weibo')}
          >
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white mb-2">
              <i className="fab fa-weibo text-xl"></i>
            </div>
            <span className="text-xs text-text-secondary">微博</span>
          </button>
          <button 
            id="share-qq" 
            className="flex flex-col items-center"
            onClick={() => handleShare('qq')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
              <i className="fab fa-qq text-xl"></i>
            </div>
            <span className="text-xs text-text-secondary">QQ</span>
          </button>
          <button 
            id="share-link" 
            className="flex flex-col items-center"
            onClick={() => handleShare('link')}
          >
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mb-2">
              <i className="fas fa-link text-xl"></i>
            </div>
            <span className="text-xs text-text-secondary">复制链接</span>
          </button>
        </div>
        <Link 
          to={`/collection-my?type=report&accommodation_id=${accommodationId}`}
          id="generate-report-button" 
          className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg flex items-center justify-center"
        >
          <i className="fas fa-file-alt mr-2"></i>
          <span>生成个性化旅游报告</span>
        </Link>
      </div>
    </div>
  );
};

export default ShareModal;