import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SurveyForm from '../components/survey/SurveyForm';
import { SurveyFormData } from '../types/survey';
import { surveyService } from '../services/surveyService';
import styles from './SurveyPage.module.css';

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedData, setSavedData] = useState<Partial<SurveyFormData> | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [surveyId, setSurveyId] = useState<string | null>(null);

  // 加载保存的调查数据
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        if (user?.id) {
          // 尝试获取用户最新的调查响应
          const response = await surveyService.getUserLatestSurvey();
          
          if (response.success && response.data && !response.data.isCompleted) {
            // 用户有未完成的调查
            setSurveyId(response.data.id);
            setSavedData(response.data);
          } else {
            // 用户没有未完成的调查，创建一个新的
            const createResponse = await surveyService.createSurvey({
              currentStep: 1,
              totalSteps: 5,
              isCompleted: false
            });
            
            if (createResponse.success && createResponse.data) {
              setSurveyId(createResponse.data.id);
            }
          }
        }
      } catch (error) {
        console.error('加载保存的调查数据失败:', error);
        // 如果API调用失败，尝试从localStorage获取
        if (user?.id) {
          const saved = localStorage.getItem(`survey_${user.id}`);
          if (saved) {
            setSavedData(JSON.parse(saved));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadSavedData();
  }, [user]);

  const handleSurveyComplete = async (data: SurveyFormData) => {
    setIsSubmitting(true);
    
    try {
      if (!surveyId) {
        throw new Error('调查ID不存在');
      }
      
      // 提交完整的调查数据
      const submitResponse = await surveyService.submitSurvey(surveyId, data);
      
      if (submitResponse.success) {
        console.log('调查提交成功:', submitResponse.data);
        
        // 清除localStorage中的临时数据
        localStorage.removeItem(`survey_${user?.id}`);
        
        setShowSuccessMessage(true);
        
        // 3秒后跳转到结果页面或首页
        setTimeout(() => {
          navigate('/survey-result', { 
            state: { surveyData: submitResponse.data } 
          });
        }, 3000);
      } else {
        throw new Error('提交调查失败');
      }
      
    } catch (error) {
      console.error('提交调查失败:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveySave = async (data: Partial<SurveyFormData>) => {
    try {
      if (surveyId) {
        // 使用API自动保存调查进度
        await surveyService.autoSaveSurvey(surveyId, {
          currentStep: data.currentStep || 1,
          data: data
        });
        console.log('调查数据已自动保存到服务器');
      } else {
        // 如果没有surveyId，临时保存到localStorage
        localStorage.setItem(`survey_${user?.id}`, JSON.stringify(data));
        console.log('调查数据已临时保存');
      }
    } catch (error) {
      console.error('保存调查数据失败:', error);
      // 如果API保存失败，回退到localStorage
      localStorage.setItem(`survey_${user?.id}`, JSON.stringify(data));
      console.log('API保存失败，已保存到本地');
    }
  };

  if (showSuccessMessage) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.successTitle}>调查提交成功！</h1>
          <p className={styles.successMessage}>
            感谢您完成旅游意向调查！我们将根据您的偏好为您推荐最适合的旅游方案。
          </p>
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <span className={styles.loadingText}>正在生成个性化推荐...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.surveyPageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>正在加载调查表单...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.surveyPageContainer}>
      <div className={styles.surveyPageHeader}>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          ← 返回
        </button>
        
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>智能旅游意向调查</h1>
          <p className={styles.pageDescription}>
            通过回答几个简单问题，我们将为您量身定制最适合的旅游推荐
          </p>
        </div>
      </div>
      
      <div className={styles.surveyContent}>
        <SurveyForm
          onComplete={handleSurveyComplete}
          onSave={handleSurveySave}
          initialData={savedData || undefined}
          userId={user?.id}
        />
      </div>
      
      {savedData && (
        <div className={styles.resumeNotice}>
          <span className={styles.resumeIcon}>💾</span>
          <span className={styles.resumeText}>
            检测到您之前保存的调查进度，已为您恢复
          </span>
        </div>
      )}
      
      {isSubmitting && (
        <div className={styles.submittingOverlay}>
          <div className={styles.submittingCard}>
            <div className={styles.submittingSpinner}></div>
            <p className={styles.submittingText}>正在提交您的调查...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;