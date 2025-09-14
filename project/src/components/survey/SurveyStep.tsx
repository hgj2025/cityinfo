import React from 'react';
import { SurveyStep as SurveyStepType, SurveyField, TravelPreferences } from '../../types/survey';
import SurveyFieldComponent from './SurveyField';
import styles from './SurveyStep.module.css';

interface SurveyStepProps {
  step: SurveyStepType;
  formData: Partial<TravelPreferences>;
  errors: Record<string, string>;
  onChange: (fieldName: string, value: any) => void;
}

const SurveyStep: React.FC<SurveyStepProps> = ({
  step,
  formData,
  errors,
  onChange
}) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>{step.title}</h2>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
      
      <div className={styles.stepContent}>
        <div className={styles.fieldsContainer}>
          {step.fields.map((field) => (
            <div key={field.id} className={styles.fieldWrapper}>
              <SurveyFieldComponent
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={(value) => onChange(field.name, value)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {step.isRequired && (
        <div className={styles.requiredNotice}>
          <span className={styles.requiredIcon}>*</span>
          <span className={styles.requiredText}>标有星号的字段为必填项</span>
        </div>
      )}
    </div>
  );
};

export default SurveyStep;