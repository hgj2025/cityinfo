
import React from 'react';

interface SidebarProps {
  activeTab: 'collections' | 'reports' | 'settings';
  onTabChange: (tab: 'collections' | 'reports' | 'settings') => void;
  userInfo: {
    displayName: string;
    email: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userInfo }) => {
  return (
    <aside id="sidebar" className="w-full md:w-60 mb-6 md:mb-0 md:mr-8">
      <div className="bg-white rounded-xl shadow-card p-4 sticky top-24">
        <div id="user-info" className="flex items-center mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mr-3">
            <i className="fas fa-user text-xl"></i>
          </div>
          <div>
            <h3 id="username" className="font-medium text-text-primary">{userInfo.displayName}</h3>
            <p id="user-email" className="text-sm text-text-secondary">{userInfo.email}</p>
          </div>
        </div>
        <nav id="sidebar-nav">
          <ul className="space-y-2">
            <li>
              <button 
                id="nav-my-collections" 
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${
                  activeTab === 'collections' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
                onClick={() => onTabChange('collections')}
              >
                <i className="fas fa-bookmark mr-3"></i>
                <span>我的收藏</span>
              </button>
            </li>
            <li>
              <button 
                id="nav-my-reports" 
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${
                  activeTab === 'reports' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
                onClick={() => onTabChange('reports')}
              >
                <i className="fas fa-file-alt mr-3"></i>
                <span>我的报告</span>
              </button>
            </li>
            <li>
              <button 
                id="nav-account-settings" 
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${
                  activeTab === 'settings' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
                onClick={() => onTabChange('settings')}
              >
                <i className="fas fa-cog mr-3"></i>
                <span>账户设置</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;