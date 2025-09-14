import React, { useState, useEffect } from 'react';
import { SurveyFormData, SurveyProgress, TravelPreferences } from '../../types/survey';
import { surveySteps, getTotalSteps } from '../../data/surveyConfig';
import SurveyStep from './SurveyStep';
import SurveyProgressComponent from './SurveyProgress';
import SurveyNavigation from './SurveyNavigation';
import styles from './SurveyForm.module.css';

interface SurveyFormProps {
  onComplete: (data: SurveyFormData) => void;
  onSave?: (data: Partial<SurveyFormData>) => void;
  initialData?: Partial<SurveyFormData>;
  userId?: string;
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  onComplete,
  onSave,
  initialData,
  userId
}) => {
  const totalSteps = getTotalSteps();
  
  const [currentStep, setCurrentStep] = useState(initialData?.currentStep || 1);
  const [formData, setFormData] = useState<Partial<TravelPreferences>>({
    travelStyle: '',
    budgetRange: '',
    travelDuration: '',
    groupSize: 1,
    travelCompanions: [],
    preferredDestinations: [],
    climatePreference: '',
    seasonPreference: [],
    domesticVsInternational: '',
    activityTypes: [],
    accommodationType: '',
    transportationMode: [],
    diningPreferences: [],
    accessibilityNeeds: [],
    dietaryRestrictions: [],
    languageBarriers: false,
    safetyPriority: 3,
    interests: [],
    travelExperience: '',
    previousDestinations: [],
    informationSources: [],
    bookingPreferences: [],
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 计算进度
  const progress: SurveyProgress = {
    currentStep,
    totalSteps,
    completedFields: Object.keys(formData).filter(key => {
      const value = formData[key as keyof TravelPreferences];
      return value !== '' && value !== undefined && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    }),
    percentage: Math.round((currentStep / totalSteps) * 100)
  };

  // 自动保存功能
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (onSave && Object.keys(formData).length > 0) {
        const saveData: Partial<SurveyFormData> = {
          ...formData,
          userId,
          currentStep,
          totalSteps,
          isCompleted: false,
          lastUpdatedAt: new Date()
        };
        onSave(saveData);
      }
    }, 2000); // 2秒后自动保存

    return () => clearTimeout(autoSaveTimer);
  }, [formData, currentStep, onSave, userId]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // 清除该字段的错误信息
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const currentStepConfig = surveySteps.find(step => step.order === currentStep);
    if (!currentStepConfig) return true;

    const newErrors: Record<string, string> = {};
    
    currentStepConfig.fields.forEach(field => {
      if (field.isRequired) {
        const value = formData[field.name];
        
        if (value === undefined || value === null || value === '') {
          newErrors[field.name] = `${field.label}是必填项`;
        } else if (Array.isArray(value) && value.length === 0) {
          newErrors[field.name] = `请至少选择一个${field.label}`;
        } else if (field.validation) {
          // 自定义验证
          if (field.validation.custom) {
            const customError = field.validation.custom(value);
            if (customError) {
              newErrors[field.name] = customError;
            }
          }
          
          // 数值范围验证
          if (field.type === 'number' || field.type === 'range') {
            const numValue = Number(value);
            if (field.validation.min !== undefined && numValue < field.validation.min) {
              newErrors[field.name] = `${field.label}不能小于${field.validation.min}`;
            }
            if (field.validation.max !== undefined && numValue > field.validation.max) {
              newErrors[field.name] = `${field.label}不能大于${field.validation.max}`;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // 只允许跳转到已完成的步骤或下一步
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      if (stepNumber === currentStep + 1) {
        // 如果要跳转到下一步，需要验证当前步骤
        if (validateCurrentStep()) {
          setCurrentStep(stepNumber);
        }
      } else {
        setCurrentStep(stepNumber);
      }
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;
    
    setIsLoading(true);
    
    try {
      const completeData: SurveyFormData = {
        ...formData as TravelPreferences,
        userId,
        currentStep: totalSteps,
        totalSteps,
        isCompleted: true,
        completedAt: new Date(),
        lastUpdatedAt: new Date()
      };
      
      await onComplete(completeData);
    } catch (error) {
      console.error('提交调查表单失败:', error);
      // 这里可以添加错误提示
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepConfig = surveySteps.find(step => step.order === currentStep);
  
  if (!currentStepConfig) {
    return <div className={styles.error}>步骤配置错误</div>;
  }

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.surveyHeader}>
        <h1 className={styles.title}>智能旅游意向调查</h1>
        <p className={styles.subtitle}>
          帮助我们了解您的旅行偏好，为您推荐最适合的旅游方案
        </p>
        <SurveyProgressComponent progress={progress} />
      </div>

      <div className={styles.surveyBody}>
        <SurveyStep
          step={currentStepConfig}
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      </div>

      <div className={styles.surveyFooter}>
        <SurveyNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onStepClick={handleStepClick}
          isLoading={isLoading}
          canGoNext={Object.keys(errors).length === 0}
        />
      </div>
      
      {/* 保存提示 */}
      <div className={styles.autoSaveIndicator}>
        <span className={styles.autoSaveText}>✓ 自动保存</span>
      </div>
    </div>
  );
};

export default SurveyForm;