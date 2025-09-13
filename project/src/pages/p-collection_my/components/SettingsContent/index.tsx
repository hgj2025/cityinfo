
import { useState } from 'react';
import { UserInfo } from '../../types';

interface SettingsContentProps {
  userInfo: UserInfo;
  onSaveSettings: (updatedInfo: UserInfo) => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ userInfo, onSaveSettings }) => {
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [email, setEmail] = useState(userInfo.email);
  const [preferredLanguage, setPreferredLanguage] = useState(userInfo.preferredLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      displayName,
      email,
      preferredLanguage
    });
  };

  return (
    <div id="settings-content" className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-bold text-text-primary mb-6">账户设置</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 个人信息设置 */}
        <div id="personal-info-settings" className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">个人信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="display-name" className="block text-sm font-medium text-text-secondary mb-1">显示名称</label>
              <input 
                type="text" 
                id="display-name" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">电子邮箱</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
        
        {/* 语言偏好设置 */}
        <div id="language-settings" className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">语言偏好</h3>
          <div>
            <label htmlFor="preferred-language" className="block text-sm font-medium text-text-secondary mb-1">首选语言</label>
            <select 
              id="preferred-language" 
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">日本語</option>
              <option value="ko-KR">한국어</option>
            </select>
          </div>
        </div>
        
        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button 
            type="submit"
            id="save-settings" 
            className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg"
          >
            保存设置
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsContent;