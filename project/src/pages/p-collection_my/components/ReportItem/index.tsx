
import { ReportItem as ReportItemType } from '../../types';
import styles from '../../styles.module.css';

interface ReportItemProps {
  report: ReportItemType;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ report, onView, onDownload, onDelete }) => {
  return (
    <div id={`report-item-${report.id}`} className={`bg-gray-50 rounded-lg p-4 ${styles.cardHover}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-text-primary">{report.title}</h3>
        <span className="text-xs text-white bg-accent px-2 py-1 rounded-full">{report.status}</span>
      </div>
      <p className="text-sm text-text-secondary mb-3">{report.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">生成于 {report.generationDate}</span>
        <div className="flex space-x-3">
          <button 
            className="text-accent hover:text-accent/80 flex items-center"
            onClick={() => onView(report.id)}
          >
            <i className="fas fa-eye mr-1"></i>
            <span>查看</span>
          </button>
          <button 
            className="text-primary hover:text-primary/80 flex items-center"
            onClick={() => onDownload(report.id)}
          >
            <i className="fas fa-download mr-1"></i>
            <span>下载</span>
          </button>
          <button 
            className="text-red-500 hover:text-red-600 flex items-center"
            onClick={() => onDelete(report.id)}
          >
            <i className="fas fa-trash-alt mr-1"></i>
            <span>删除</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;