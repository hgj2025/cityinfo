import React from 'react';
import { SurveyField as SurveyFieldType } from '../../types/survey';
import styles from './SurveyField.module.css';

interface SurveyFieldProps {
  field: SurveyFieldType;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

const SurveyField: React.FC<SurveyFieldProps> = ({
  field,
  value,
  error,
  onChange
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (field.type === 'number' || field.type === 'range') {
      onChange(Number(newValue));
    } else {
      onChange(newValue);
    }
  };

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter((v: string) => v !== optionValue));
    }
  };

  const handleRadioChange = (optionValue: string) => {
    onChange(optionValue);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            required={field.isRequired}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            required={field.isRequired}
          />
        );

      case 'range':
        return (
          <div className={styles.rangeContainer}>
            <input
              type="range"
              id={field.id}
              value={value || field.validation?.min || 0}
              onChange={handleInputChange}
              min={field.validation?.min}
              max={field.validation?.max}
              step={field.validation?.step || 1}
              className={styles.rangeInput}
              required={field.isRequired}
            />
            <div className={styles.rangeValue}>
              {value || field.validation?.min || 0}
              {field.validation?.unit && ` ${field.validation.unit}`}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            rows={field.validation?.rows || 4}
            className={`${styles.textarea} ${error ? styles.inputError : ''}`}
            required={field.isRequired}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            className={`${styles.select} ${error ? styles.inputError : ''}`}
            required={field.isRequired}
          >
            <option value="">请选择...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {field.options?.map((option) => (
              <label key={option.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleRadioChange(option.value)}
                  className={styles.radioInput}
                  required={field.isRequired}
                />
                <span className={styles.radioText}>{option.label}</span>
                {option.description && (
                  <span className={styles.optionDescription}>{option.description}</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={styles.checkboxGroup}>
            {field.options?.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              return (
                <label key={option.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>{option.label}</span>
                  {option.description && (
                    <span className={styles.optionDescription}>{option.description}</span>
                  )}
                </label>
              );
            })}
          </div>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className={styles.multiselectContainer}>
            <div className={styles.selectedTags}>
              {selectedValues.map((selectedValue: string) => {
                const option = field.options?.find(opt => opt.value === selectedValue);
                return option ? (
                  <span key={selectedValue} className={styles.tag}>
                    {option.label}
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange(selectedValue, false)}
                      className={styles.tagRemove}
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
            <select
              onChange={(e) => {
                if (e.target.value && !selectedValues.includes(e.target.value)) {
                  handleCheckboxChange(e.target.value, true);
                }
                e.target.value = ''; // 重置选择
              }}
              className={styles.multiselectDropdown}
            >
              <option value="">添加选项...</option>
              {field.options?.filter(option => !selectedValues.includes(option.value)).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            required={field.isRequired}
          />
        );
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={field.id} className={styles.label}>
        {field.label}
        {field.isRequired && <span className={styles.required}>*</span>}
      </label>
      
      {field.description && (
        <p className={styles.fieldDescription}>{field.description}</p>
      )}
      
      <div className={styles.inputContainer}>
        {renderField()}
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠</span>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
      
      {field.helpText && !error && (
        <div className={styles.helpText}>{field.helpText}</div>
      )}
    </div>
  );
};

export default SurveyField;