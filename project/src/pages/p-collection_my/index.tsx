
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import CollectionsContent from './components/CollectionsContent';
import ReportsContent from './components/ReportsContent';
import SettingsContent from './components/SettingsContent';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import GenerateReportModal from './components/GenerateReportModal';
import { CollectionItem, ReportItem, UserInfo } from './types';


const CollectionMyPage: React.FC = () => {
  // Set page title
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '锦绣中华行 - 我的收藏';
    return () => { document.title = originalTitle; };
  }, []);

  // State for active tab
  const [activeTab, setActiveTab] = useState<'collections' | 'reports' | 'settings'>('collections');
  
  // State for modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // User info state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    displayName: '旅行者',
    email: 'traveler@example.com',
    preferredLanguage: 'zh-CN'
  });

  // Collection items state
  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: 'beijing',
      type: 'city',
      title: '北京',
      description: '中国首都，拥有丰富的历史文化遗产和现代都市风貌',
      imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
      collectionDate: '2023-06-15'
    },
    {
      id: 'greatwall',
      type: 'attraction',
      title: '长城',
      description: '世界文化遗产，中华文明的伟大象征，蜿蜒于崇山峻岭之间',
      imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
      collectionDate: '2023-06-18'
    },
    {
      id: 'duck',
      type: 'food',
      title: '北京烤鸭',
      description: '外脆里嫩，色泽红亮，中国烹饪艺术的杰出代表',
      imageUrl: 'https://images.unsplash.com/photo-1518983546435-91f8b87fe561',
      collectionDate: '2023-06-20'
    },
    {
      id: 'hotel',
      type: 'accommodation',
      title: '北京四季酒店',
      description: '位于北京市中心的豪华酒店，提供舒适的住宿体验和便捷的交通',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      collectionDate: '2023-06-22'
    }
  ]);

  // Reports state
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: '1',
      title: '北京文化之旅',
      description: '基于您收藏的北京相关内容，包含长城、故宫、颐和园等景点的个性化旅游建议',
      status: 'generated',
      generationDate: '2023-06-25'
    },
    {
      id: '2',
      title: '江南水乡游',
      description: '基于您收藏的苏州、杭州等江南城市内容，包含西湖、拙政园等景点的个性化旅游建议',
      status: 'generated',
      generationDate: '2023-07-10'
    }
  ]);

  // Handle tab change
  const handleTabChange = (tab: 'collections' | 'reports' | 'settings') => {
    setActiveTab(tab);
  };

  // Handle delete collection
  const handleDeleteCollection = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete collection
  const confirmDeleteCollection = () => {
    if (itemToDelete) {
      setCollections(collections.filter(item => item.id !== itemToDelete));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Handle view report
  const handleViewReport = (id: string) => {
    console.log(`查看报告 ID: ${id}`);
    // 在实际应用中，这里会打开报告详情
  };

  // Handle download report
  const handleDownloadReport = (id: string) => {
    console.log(`下载报告 ID: ${id}`);
    // 在实际应用中，这里会下载报告
  };

  // Handle delete report
  const handleDeleteReport = (id: string) => {
    if (window.confirm(`确定要删除此报告吗？`)) {
      setReports(reports.filter(report => report.id !== id));
    }
  };

  // Handle generate report
  const handleGenerateReport = () => {
    setIsGenerateReportModalOpen(true);
  };

  // Confirm generate report
  const confirmGenerateReport = (reportName: string, options: { [key: string]: boolean }) => {
    // 在实际应用中，这里会调用API生成报告
    console.log('生成报告:', reportName, options);
    
    // 模拟添加新报告
    const newReport: ReportItem = {
      id: `${reports.length + 1}`,
      title: reportName,
      description: `基于您的收藏内容生成的个性化旅游建议`,
      status: 'generated',
      generationDate: new Date().toISOString().split('T')[0]
    };
    
    setReports([newReport, ...reports]);
    setIsGenerateReportModalOpen(false);
    setActiveTab('reports');
  };

  // Handle save settings
  const handleSaveSettings = (updatedInfo: UserInfo) => {
    setUserInfo(updatedInfo);
    alert('设置已保存');
  };

  return (
    <div className="bg-bg-light min-h-screen">
      <Header />
      
      {/* 主内容区 */}
      <main id="main-content" className="container mx-auto px-4 pt-24 md:pt-20 pb-12 flex flex-col md:flex-row">
        {/* 左侧菜单 */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          userInfo={userInfo} 
        />

        {/* 右侧内容区 */}
        <div id="content-area" className="flex-1">
          {/* 我的收藏内容 */}
          {activeTab === 'collections' && (
            <CollectionsContent 
              collections={collections} 
              onDeleteCollection={handleDeleteCollection} 
            />
          )}

          {/* 我的报告内容 */}
          {activeTab === 'reports' && (
            <ReportsContent 
              reports={reports}
              onViewReport={handleViewReport}
              onDownloadReport={handleDownloadReport}
              onDeleteReport={handleDeleteReport}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {/* 账户设置内容 */}
          {activeTab === 'settings' && (
            <SettingsContent 
              userInfo={userInfo}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* 确认删除收藏弹窗 */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCollection}
      />

      {/* 生成报告弹窗 */}
      <GenerateReportModal 
        isOpen={isGenerateReportModalOpen}
        onCancel={() => setIsGenerateReportModalOpen(false)}
        onGenerate={confirmGenerateReport}
      />
    </div>
  );
};

export default CollectionMyPage;