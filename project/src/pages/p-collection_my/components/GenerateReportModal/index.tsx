
import { useState } from 'react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onGenerate: (reportName: string, options: { [key: string]: boolean }) => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onCancel, onGenerate }) => {
  const [reportName, setReportName] = useState('');
  const [options, setOptions] = useState({
    includeCities: true,
    includeAttractions: true,
    includeFood: true,
    includeAccommodation: true
  });

  const handleOptionChange = (option: string) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }));
  };

  const handleSubmit = () => {
    if (!reportName.trim()) return;
    onGenerate(reportName, options);
    setReportName('');
  };

  if (!isOpen) return null;

  return (
    <div id="generate-report-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-text-primary mb-3">生成个性化旅游报告</h3>
        <div className="mb-4">
          <label htmlFor="report-name" className="block text-sm font-medium text-text-secondary mb-1">报告名称</label>
          <input 
            type="text" 
            id="report-name" 
            placeholder="例如：北京三日游" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="report-content" className="block text-sm font-medium text-text-secondary mb-1">包含内容</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="include-cities" 
                className="mr-2" 
                checked={options.includeCities}
                onChange={() => handleOptionChange('includeCities')}
              />
              <label htmlFor="include-cities" className="text-text-secondary">收藏的城市</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="include-attractions" 
                className="mr-2" 
                checked={options.includeAttractions}
                onChange={() => handleOptionChange('includeAttractions')}
              />
              <label htmlFor="include-attractions" className="text-text-secondary">收藏的景点</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="include-food" 
                className="mr-2" 
                checked={options.includeFood}
                onChange={() => handleOptionChange('includeFood')}
              />
              <label htmlFor="include-food" className="text-text-secondary">收藏的美食</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="include-accommodation" 
                className="mr-2" 
                checked={options.includeAccommodation}
                onChange={() => handleOptionChange('includeAccommodation')}
              />
              <label htmlFor="include-accommodation" className="text-text-secondary">收藏的住宿</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            id="cancel-generate" 
            className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50"
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            id="confirm-generate" 
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            onClick={handleSubmit}
            disabled={!reportName.trim()}
          >
            生成报告
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;