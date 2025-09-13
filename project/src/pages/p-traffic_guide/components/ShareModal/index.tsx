
interface ShareModalProps {
  onClose: () => void;
}

const ShareModal = ({ onClose }: ShareModalProps) => {
  const handleCancelClick = () => {
    onClose();
  };

  return (
    <div id="share-modal" className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">分享</h3>
          <button 
            id="close-share-modal" 
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mb-4">
          <p className="text-text-secondary mb-3">分享南京交通指南给朋友</p>
          <div className="flex justify-center space-x-6 py-4">
            <a href="#" className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-2">
                <i className="fab fa-weixin text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">微信</span>
            </a>
            <a href="#" className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white mb-2">
                <i className="fab fa-weibo text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">微博</span>
            </a>
            <a href="#" className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
                <i className="fas fa-link text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">复制链接</span>
            </a>
            <a href="#" className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white mb-2">
                <i className="fas fa-file-alt text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">生成报告</span>
            </a>
          </div>
        </div>
        <button 
          id="cancel-share" 
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-text-primary"
          onClick={handleCancelClick}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default ShareModal;