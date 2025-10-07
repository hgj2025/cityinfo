import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TaskDetails.module.css';
import api from '../../../services/api';

interface TaskDetails {
  id: string;
  city: string;
  dataType: string;
  status: string;
  progress: number;
  result?: any;
  error?: string;
  cozeRequest?: any;
  cozeResponse?: any;
  cozeApiCalls?: any[];
  executionSteps?: any[];
  dataProcessing?: any;
  parseError?: string;  // 数据解析错误信息
  createdAt: string;
  updatedAt: string;
  reviews?: any[];
}

interface ExecutionStep {
  step: string;
  timestamp: string;
  description: string;
  data?: any;
}

interface ApiCall {
  startTime: string;
  endTime: string;
  duration: number;
  request: any;
  response: any;
  success: boolean;
}

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'execution' | 'api-calls' | 'data'>('overview');

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
    }
  }, [taskId]);

  const fetchTaskDetails = async (id: string) => {
    try {
      setLoading(true);
      const data = await api.get(`/admin/data-collection/tasks/${id}/details`);
      setTaskDetails(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#52c41a';
      case 'running': return '#1890ff';
      case 'failed': return '#ff4d4f';
      case 'pending': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'running': return '运行中';
      case 'failed': return '失败';
      case 'pending': return '等待中';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (error || !taskDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>加载失败</h3>
          <p>{error || '任务详情不存在'}</p>
          <button onClick={() => navigate('/p-admin')} className={styles.backButton}>
            返回管理页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/p-admin')} className={styles.backButton}>
          ← 返回
        </button>
        <h1>任务详情</h1>
        <div className={styles.taskInfo}>
          <span className={styles.taskId}>ID: {taskDetails.id}</span>
          <span 
            className={styles.status}
            style={{ backgroundColor: getStatusColor(taskDetails.status) }}
          >
            {getStatusText(taskDetails.status)}
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'execution' ? styles.active : ''}`}
          onClick={() => setActiveTab('execution')}
        >
          执行步骤
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'api-calls' ? styles.active : ''}`}
          onClick={() => setActiveTab('api-calls')}
        >
          API调用
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'data' ? styles.active : ''}`}
          onClick={() => setActiveTab('data')}
        >
          数据详情
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            <div className={styles.card}>
              <h3>基本信息</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>城市:</label>
                  <span>{taskDetails.city}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>数据类型:</label>
                  <span>{taskDetails.dataType}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>进度:</label>
                  <span>{taskDetails.progress}%</span>
                </div>
                <div className={styles.infoItem}>
                  <label>创建时间:</label>
                  <span>{formatTimestamp(taskDetails.createdAt)}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>更新时间:</label>
                  <span>{formatTimestamp(taskDetails.updatedAt)}</span>
                </div>
              </div>
            </div>

            {taskDetails.cozeRequest && (
              <div className={styles.card}>
                <h3>Coze请求参数</h3>
                <pre className={styles.codeBlock}>
                  {JSON.stringify(taskDetails.cozeRequest, null, 2)}
                </pre>
              </div>
            )}

            {taskDetails.cozeResponse && (
              <div className={styles.card}>
                <h3>Coze响应结果</h3>
                <pre className={styles.codeBlock}>
                  {JSON.stringify(taskDetails.cozeResponse, null, 2)}
                </pre>
              </div>
            )}

            {taskDetails.error && (
              <div className={styles.card}>
                <h3>错误信息</h3>
                <div className={styles.errorMessage}>{taskDetails.error}</div>
              </div>
            )}

            {taskDetails.parseError && (
              <div className={styles.card}>
                <h3>数据解析错误</h3>
                <div className={styles.errorMessage}>{taskDetails.parseError}</div>
                {taskDetails.cozeResponse?.rawContent && (
                  <div style={{ marginTop: '16px' }}>
                    <h4>Coze原始返回数据</h4>
                    <pre className={styles.codeBlock}>
                      {typeof taskDetails.cozeResponse.rawContent === 'string' 
                        ? taskDetails.cozeResponse.rawContent 
                        : JSON.stringify(taskDetails.cozeResponse.rawContent, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'execution' && (
          <div className={styles.execution}>
            <h3>执行步骤时间线</h3>
            {taskDetails.executionSteps && taskDetails.executionSteps.length > 0 ? (
              <div className={styles.timeline}>
                {taskDetails.executionSteps.map((step: ExecutionStep, index: number) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.stepHeader}>
                        <h4>{step.description}</h4>
                        <span className={styles.timestamp}>
                          {formatTimestamp(step.timestamp)}
                        </span>
                      </div>
                      <div className={styles.stepType}>{step.step}</div>
                      {step.data && (
                        <details className={styles.stepData}>
                          <summary>查看详细数据</summary>
                          <pre>{JSON.stringify(step.data, null, 2)}</pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>暂无执行步骤记录</div>
            )}
          </div>
        )}

        {activeTab === 'api-calls' && (
          <div className={styles.apiCalls}>
            <h3>API调用记录</h3>
            {taskDetails.cozeApiCalls && taskDetails.cozeApiCalls.length > 0 ? (
              <div className={styles.apiCallsList}>
                {taskDetails.cozeApiCalls.map((call: ApiCall, index: number) => (
                  <div key={index} className={styles.apiCallItem}>
                    <div className={styles.apiCallHeader}>
                      <h4>API调用 #{index + 1}</h4>
                      <div className={styles.apiCallMeta}>
                        <span className={`${styles.apiStatus} ${call.success ? styles.success : styles.failed}`}>
                          {call.success ? '成功' : '失败'}
                        </span>
                        <span className={styles.duration}>
                          耗时: {formatDuration(call.duration)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.apiCallTimes}>
                      <div>开始: {formatTimestamp(call.startTime)}</div>
                      <div>结束: {formatTimestamp(call.endTime)}</div>
                    </div>
                    <div className={styles.apiCallDetails}>
                      <details>
                        <summary>请求参数</summary>
                        <pre>{JSON.stringify(call.request, null, 2)}</pre>
                      </details>
                      <details>
                        <summary>响应结果</summary>
                        <pre>{JSON.stringify(call.response, null, 2)}</pre>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>暂无API调用记录</div>
            )}
          </div>
        )}

        {activeTab === 'data' && (
          <div className={styles.dataDetails}>
            <h3>数据处理详情</h3>
            {taskDetails.dataProcessing && (
              <div className={styles.card}>
                <h4>处理统计</h4>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>处理数据量:</label>
                    <span>{taskDetails.dataProcessing.totalProcessed}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>处理时间:</label>
                    <span>{formatDuration(taskDetails.dataProcessing.processingTime)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>执行步骤数:</label>
                    <span>{taskDetails.dataProcessing.steps}</span>
                  </div>
                </div>
              </div>
            )}

            {taskDetails.reviews && taskDetails.reviews.length > 0 && (
              <div className={styles.card}>
                <h4>审核记录 ({taskDetails.reviews.length})</h4>
                <div className={styles.reviewsList}>
                  {taskDetails.reviews.map((review: any, index: number) => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span>#{index + 1}</span>
                        <span className={`${styles.reviewStatus} ${styles[review.status]}`}>
                          {review.status === 'pending' ? '待审核' : 
                           review.status === 'approved' ? '已通过' : '已拒绝'}
                        </span>
                      </div>
                      <div className={styles.reviewTime}>
                        创建时间: {formatTimestamp(review.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {taskDetails.result && (
              <div className={styles.card}>
                <h4>最终结果数据</h4>
                <pre className={styles.codeBlock}>
                  {JSON.stringify(taskDetails.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;