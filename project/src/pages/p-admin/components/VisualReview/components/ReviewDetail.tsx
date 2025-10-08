import React from 'react';
import { ReviewDetailProps } from '../types';
import TextInfoSection from './TextInfoSection';
import styles from '../../VisualReviewInterface.module.css';

const ReviewDetail: React.FC<ReviewDetailProps> = ({ data }) => {
  return (
    <div className={styles.reviewDetailWrapper}>
      <TextInfoSection data={data} />
    </div>
  );
};

export default ReviewDetail;