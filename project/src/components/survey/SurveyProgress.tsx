import React from 'react';
import { SurveyProgress as SurveyProgressType } from '../../types/survey';
import styles from './SurveyProgress.module.css';

interface SurveyProgressProps {
  progress: SurveyProgressType;
}

const SurveyProgress: React.FC<SurveyProgressProps> = ({ progress }) => {
  const { currentStep, totalSteps, percentage, completedFields } = progress;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <div className={styles.stepInfo}>
          <span className={styles.stepText}>
            第 {currentStep} 步，共 {totalSteps} 步
          </span>
          <span className={styles.percentageText}>
            {percentage}% 完成
          </span>
        </div>
      </div>
      
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarBackground}>
          <div 
            className={styles.progressBarFill}
            style={{ width: `${percentage}%` }}
          >
            <div className={styles.progressBarGlow}></div>
          </div>
        </div>
      </div>
      
      <div className={styles.stepIndicators}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <div
              key={stepNumber}
              className={`
                ${styles.stepIndicator}
                ${isCompleted ? styles.completed : ''}
                ${isCurrent ? styles.current : ''}
                ${isUpcoming ? styles.upcoming : ''}
              `}
            >
              <div className={styles.stepCircle}>
                {isCompleted ? (
                  <span className={styles.checkIcon}>✓</span>
                ) : (
                  <span className={styles.stepNumber}>{stepNumber}</span>
                )}
              </div>
              
              {stepNumber < totalSteps && (
                <div className={`
                  ${styles.stepConnector}
                  ${isCompleted ? styles.connectorCompleted : ''}
                `}></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className={styles.progressDetails}>
        <div className={styles.completedFieldsInfo}>
          <span className={styles.completedFieldsText}>
            已填写 {completedFields.length} 个字段
          </span>
        </div>
      </div>
    </div>
  );
};

export default SurveyProgress;