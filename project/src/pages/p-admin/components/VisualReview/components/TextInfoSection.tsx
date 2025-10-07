import React from 'react';
import { TextInfoSectionProps } from '../types';
import { extractTextInfo, getFieldLabel } from '../utils';
import styles from '../../VisualReviewInterface.module.css';

const TextInfoSection: React.FC<TextInfoSectionProps> = ({ data }) => {
  const textInfo = extractTextInfo(data);

  return (
    <div className={`${styles.detailColumn} ${styles.textColumn}`}>
      <div className={styles.textSection}>
        <h3>基本信息</h3>
        <div className={styles.textInfo}>
          {Object.entries(textInfo).map(([key, value]) => {
            // 跳过内部生成的字段和pictureAdvises字段（将在第二列单独展示）
            if (key.endsWith('_count') || key.endsWith('_preview') || key === 'pictureAdvises') {
              return null;
            }
            
            const label = getFieldLabel(key);
            
            return (
              <div key={key} className={styles.textItem}>
                <label>{label}:</label>
                <span>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TextInfoSection;