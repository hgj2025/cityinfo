
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, cityName }) => {
  const navigate = useNavigate();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // 模拟生成报告的过程
    setTimeout(() => {
      setIsGeneratingReport(false);
      onClose();
      alert('报告生成中，请稍候...');
      
      // 再延迟一段时间后跳转
      setTimeout(() => {
        navigate('/collection-my?type=report');
      }, 1500);
    }, 500);
  };

  if (!isOpen) return null;

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
          <h3 className="text-lg font-bold text-text-primary">分享{cityName}</h3>
          <button 
            id="close-share-modal" 
            className="text-text-secondary hover:text-text-primary"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mb-6">
          <p className="text-text-secondary text-sm mb-4">分享这座城市的精彩给你的朋友</p>
          <div className="flex justify-center space-x-6">
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#07C160] flex items-center justify-center text-white mb-2">
                <i className="fab fa-weixin text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">微信</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EB4335] flex items-center justify-center text-white mb-2">
                <i className="fab fa-weibo text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">微博</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white mb-2">
                <i className="fas fa-link text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">复制链接</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#4267B2] flex items-center justify-center text-white mb-2">
                <i className="fas fa-qrcode text-xl"></i>
              </div>
              <span className="text-xs text-text-secondary">二维码</span>
            </button>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <button 
            id="generate-report-button" 
            className="w-full py-2 bg-accent text-white rounded-lg flex items-center justify-center"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            <i className="fas fa-file-alt mr-2"></i>
            <span>{isGeneratingReport ? '生成中...' : '生成个性化旅游报告'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;