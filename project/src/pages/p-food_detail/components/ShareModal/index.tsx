
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const handleShareWechat = () => {
    console.log('分享到微信');
    onClose();
  };

  const handleShareWeibo = () => {
    console.log('分享到微博');
    onClose();
  };

  const handleShareQQ = () => {
    console.log('分享到QQ');
    onClose();
  };

  const handleShareLink = () => {
    console.log('复制链接');
    alert('链接已复制到剪贴板');
    onClose();
  };

  const handleGenerateReport = () => {
    console.log('生成个性化旅游报告');
    alert('个性化旅游报告已生成，可在"我的收藏"页面查看');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="share-modal" className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
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
          <button id="share-wechat" className="flex flex-col items-center" onClick={handleShareWechat}>
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-2">
              <i className="fab fa-weixin text-xl"></i>
            </div>
            <span className="text-text-secondary text-xs">微信</span>
          </button>
          <button id="share-weibo" className="flex flex-col items-center" onClick={handleShareWeibo}>
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white mb-2">
              <i className="fab fa-weibo text-xl"></i>
            </div>
            <span className="text-text-secondary text-xs">微博</span>
          </button>
          <button id="share-qq" className="flex flex-col items-center" onClick={handleShareQQ}>
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
              <i className="fab fa-qq text-xl"></i>
            </div>
            <span className="text-text-secondary text-xs">QQ</span>
          </button>
          <button id="share-link" className="flex flex-col items-center" onClick={handleShareLink}>
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mb-2">
              <i className="fas fa-link text-xl"></i>
            </div>
            <span className="text-text-secondary text-xs">复制链接</span>
          </button>
        </div>
        <button 
          id="generate-report-button" 
          className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
          onClick={handleGenerateReport}
        >
          <i className="fas fa-file-alt mr-2"></i>
          <span>生成个性化旅游报告</span>
        </button>
      </div>
    </div>
  );
};

export default ShareModal;