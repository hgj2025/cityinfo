
import { useState } from 'react';
import { ReportItem as ReportItemType } from '../../types';
import ReportItem from '../ReportItem';

interface ReportsContentProps {
  reports: ReportItemType[];
  onViewReport: (id: string) => void;
  onDownloadReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onGenerateReport: () => void;
}

const ReportsContent: React.FC<ReportsContentProps> = ({ 
  reports, 
  onViewReport, 
  onDownloadReport, 
  onDeleteReport,
  onGenerateReport
}) => {
  return (
    <div id="reports-content" className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">我的旅游报告</h2>
        <button 
          id="generate-report-btn" 
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={onGenerateReport}
        >
          <i className="fas fa-plus mr-2"></i>
          <span>生成新报告</span>
        </button>
      </div>

      {/* 报告列表 */}
      <div id="report-list" className="space-y-4">
        {reports.length > 0 ? (
          reports.map(report => (
            <ReportItem 
              key={report.id} 
              report={report} 
              onView={onViewReport}
              onDownload={onDownloadReport}
              onDelete={onDeleteReport}
            />
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            您还没有生成任何旅游报告
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsContent;