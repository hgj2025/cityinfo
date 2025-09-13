
interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  onGenerateReport: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isVisible, onClose, onGenerateReport }) => {
  if (!isVisible) return null;

  return (
    <div 
      id="share-modal" 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
        <div className="space-y-4">
          <p className="text-text-secondary">分享长城的精彩体验给你的朋友</p>
          <div className="grid grid-cols-4 gap-4">
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#07C160] flex items-center justify-center text-white mb-1">
                <i className="fab fa-weixin"></i>
              </div>
              <span className="text-xs text-text-secondary">微信</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#DF2029] flex items-center justify-center text-white mb-1">
                <i className="fab fa-weibo"></i>
              </div>
              <span className="text-xs text-text-secondary">微博</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#0088FF] flex items-center justify-center text-white mb-1">
                <i className="fab fa-qq"></i>
              </div>
              <span className="text-xs text-text-secondary">QQ</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FF4D4F] flex items-center justify-center text-white mb-1">
                <i className="fas fa-link"></i>
              </div>
              <span className="text-xs text-text-secondary">复制链接</span>
            </button>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button 
              id="generate-report-button" 
              className="w-full py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              onClick={onGenerateReport}
            >
              生成个性化旅游报告
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;