import React from 'react';
import { ReviewDetailProps } from '../types';
import TextInfoSection from './TextInfoSection';
import ImageSelectionSection from './ImageSelectionSection';
import ImageAdviseSection from './ImageAdviseSection';
import { useImageSelection } from '../hooks/useImageSelection';
import { extractImages } from '../utils';
import styles from '../../VisualReviewInterface.module.css';

const ReviewDetail: React.FC<ReviewDetailProps> = ({ data }) => {
  const images = extractImages(data);
  const {
    selectedPictures,
    selectedImages,
    imageFilter,
    handleImageToggle,
    handleSelectAll,
    handleDeselectAll,
    handlePictureToggle,
    setImageFilter
  } = useImageSelection(images);

  return (
    <div className={styles.detailContent}>
      <div className={styles.detailLayout}>
        {/* 第一列：文本信息 */}
        <TextInfoSection data={data} />

        {/* 第二列：图片选择 */}
        <div className={`${styles.detailColumn} ${styles.imageColumn}`}>
          <ImageSelectionSection
            selectedImages={selectedImages}
            imageFilter={imageFilter}
            onImageToggle={handleImageToggle}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onFilterChange={setImageFilter}
          />
        </div>

        {/* 第三列和第四列：图片建议 */}
        <ImageAdviseSection
          data={data}
          selectedPictures={selectedPictures}
          onPictureToggle={handlePictureToggle}
        />
      </div>
    </div>
  );
};

export default ReviewDetail;