import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SurveyForm from '../components/survey/SurveyForm';
import { SurveyFormData } from '../types/survey';
import styles from './SurveyPage.module.css';

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedData, setSavedData] = useState<Partial<SurveyFormData> | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  // 加载保存的调查数据
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        if (user?.id) {
          // 这里应该调用API获取用户保存的调查数据
          // const response = await surveyService.getSavedSurvey(user.id);
          // setSavedData(response.data);
          
          // 临时从localStorage获取
          const saved = localStorage.getItem(`survey_${user.id}`);
          if (saved) {
            setSavedData(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('加载保存的调查数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedData();
  }, [user]);

  const handleSurveyComplete = async (data: SurveyFormData) => {
    setIsSubmitting(true);
    
    try {
      // 这里应该调用API提交调查数据
      // await surveyService.submitSurvey(data);
      
      // 临时保存到localStorage
      localStorage.setItem(`survey_completed_${user?.id}`, JSON.stringify(data));
      localStorage.removeItem(`survey_${user?.id}`); // 清除临时保存的数据
      
      console.log('调查提交成功:', data);
      
      setShowSuccessMessage(true);
      
      // 3秒后跳转到结果页面或首页
      setTimeout(() => {
        navigate('/survey-result', { 
          state: { surveyData: data } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('提交调查失败:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveySave = async (data: Partial<SurveyFormData>) => {
    try {
      // 这里应该调用API保存调查数据
      // await surveyService.saveSurvey(data);
      
      // 临时保存到localStorage
      localStorage.setItem(`survey_${user?.id}`, JSON.stringify(data));
      
      console.log('调查数据已自动保存');
    } catch (error) {
      console.error('保存调查数据失败:', error);
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