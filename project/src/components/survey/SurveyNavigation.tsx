import React from 'react';
import styles from './SurveyNavigation.module.css';

interface SurveyNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onStepClick: (stepNumber: number) => void;
  isLoading: boolean;
  canGoNext: boolean;
}

const SurveyNavigation: React.FC<SurveyNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onStepClick,
  isLoading,
  canGoNext
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={styles.navigationContainer}>
      {/* 步骤快速导航 */}
      <div className={styles.stepNavigation}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const canNavigate = stepNumber <= currentStep || stepNumber === currentStep + 1;
          
          return (
            <button
              key={stepNumber}
              onClick={() => canNavigate && onStepClick(stepNumber)}
              disabled={!canNavigate || isLoading}
              className={`
                ${styles.stepButton}
                ${isCompleted ? styles.stepCompleted : ''}
                ${isCurrent ? styles.stepCurrent : ''}
                ${!canNavigate ? styles.stepDisabled : ''}
              `}
              title={`第 ${stepNumber} 步`}
            >
              {isCompleted ? (
                <span className={styles.stepCheckIcon}>✓</span>
              ) : (
                <span className={styles.stepNumberText}>{stepNumber}</span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* 主要导航按钮 */}
      <div className={styles.mainNavigation}>
        <button
          onClick={onPrevious}
          disabled={isFirstStep || isLoading}
          className={`${styles.navButton} ${styles.previousButton}`}
        >
          <span className={styles.buttonIcon}>←</span>
          <span className={styles.buttonText}>上一步</span>
        </button>
        
        <div className={styles.stepInfo}>
          <span className={styles.currentStepText}>
            {currentStep} / {totalSteps}
          </span>
        </div>
        
        <button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={`
            ${styles.navButton} 
            ${isLastStep ? styles.submitButton : styles.nextButton}
          `}
        >
          {isLoading ? (
            <>
              <span className={styles.loadingSpinner}></span>
              <span className={styles.buttonText}>处理中...</span>
            </>
          ) : (
            <>
              <span className={styles.buttonText}>
                {isLastStep ? '完成调查' : '下一步'}
              </span>
              {!isLastStep && <span className={styles.buttonIcon}>→</span>}
            </>
          )}
        </button>
      </div>
      
      {/* 提示信息 */}
      <div className={styles.navigationHints}>
        {!canGoNext && (
          <div className={styles.validationHint}>
            <span className={styles.hintIcon}>ⓘ</span>
            <span className={styles.hintText}>请完成必填字段后继续</span>
          </div>
        )}
        
        {isLastStep && canGoNext && (
          <div className={styles.completionHint}>
            <span className={styles.hintIcon}>🎉</span>
            <span className={styles.hintText}>太棒了！点击完成调查提交您的偏好</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyNavigation;