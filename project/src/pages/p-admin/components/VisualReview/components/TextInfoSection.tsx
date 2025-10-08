import React, { useState, useCallback } from 'react';
import { TextInfoSectionProps } from '../types';
import { extractTextInfo, getFieldLabel } from '../utils';
import styles from '../../VisualReviewInterface.module.css';

interface FieldImage {
  url: string;
  title?: string;
}

interface FieldImages {
  [fieldKey: string]: FieldImage[];
}

const TextInfoSection: React.FC<TextInfoSectionProps> = ({ data }) => {
  const textInfo = extractTextInfo(data);
  const [fieldImages, setFieldImages] = useState<FieldImages>({});
  const [dragOverField, setDragOverField] = useState<string | null>(null);
  
  // 可配置的隐藏字段列表
  const hiddenFields = [
    'pictureAdvises', // 图片建议字段
    'images', // 图片字段
    'pictures', // 图片字段
    'image', // 单个图片字段
    'dataType', // 数据类型字段
    'data.city', // 城市数据字段
    'data.pictureAdvises', // 数据中的图片建议字段
    'source', // 来源字段
    'id', // ID字段（已在标题下显示）
    'taskId', // 任务ID字段（已在标题下显示）
    'status', // 状态字段（已在标题下显示）
    'createdAt', // 创建时间字段（已在标题下显示）
    'updatedAt' // 更新时间字段（已在标题下显示）
  ];
  
  // 内部生成的字段（自动隐藏）
  const internalFields = (key: string) => 
    key.endsWith('_count') || key.endsWith('_preview');

  // 处理拖拽放置
  const handleDrop = useCallback((e: React.DragEvent, fieldKey: string) => {
    console.log('=== 拖拽放置事件开始 ===');
    console.log('目标字段:', fieldKey);
    console.log('事件对象:', e);
    console.log('dataTransfer对象:', e.dataTransfer);
    console.log('可用数据类型:', e.dataTransfer.types);
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // 获取拖拽的数据
      const textData = e.dataTransfer.getData('text/plain');
      const urlData = e.dataTransfer.getData('text/uri-list');
      
      console.log('text/plain 数据:', textData);
      console.log('text/uri-list 数据:', urlData);
      
      // 优先使用 text/uri-list，如果没有则使用 text/plain
      let imageUrl = urlData || textData;
      
      if (!imageUrl) {
        console.warn('没有获取到任何URL数据');
        alert('拖拽失败：没有获取到图片URL');
        return;
      }
      
      // 清理URL，移除前后空白字符
      imageUrl = imageUrl.trim();
      
      if (imageUrl === '') {
        console.warn('URL数据为空');
        alert('拖拽失败：图片URL为空');
        return;
      }
      
      // 验证是否是有效的URL
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        console.warn('无效的URL格式:', imageUrl);
        alert('拖拽失败：无效的图片URL格式');
        return;
      }
      
      console.log('接收到有效的图片URL:', imageUrl);
      
      // 创建图片对象
      const imageData = {
        url: imageUrl,
        title: `拖拽图片 - ${new Date().toLocaleTimeString()}`,
        group: '拖拽添加'
      };
      
      console.log('创建的图片数据对象:', imageData);
      
      // 添加到字段图片列表
      setFieldImages(prev => {
        const newState = {
          ...prev,
          [fieldKey]: [...(prev[fieldKey] || []), imageData]
        };
        console.log('更新字段图片状态:', newState);
        return newState;
      });
      
      console.log('图片URL添加成功');
      alert(`图片已添加到字段: ${fieldKey}`);
      
    } catch (error) {
      console.error('拖拽处理过程中发生未知错误:', error);
      console.error('错误堆栈:', error.stack);
      alert(`拖拽失败：未知错误 - ${error.message}`);
    }
    
    console.log('=== 拖拽放置事件结束 ===');
  }, []);

  // 处理拖拽悬停
  const handleDragOver = useCallback((e: React.DragEvent, fieldKey: string) => {
    console.log('拖拽悬停事件触发:', fieldKey);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 处理拖拽进入
  const handleDragEnter = useCallback((e: React.DragEvent, fieldKey: string) => {
    console.log('拖拽进入事件触发:', fieldKey);
    e.preventDefault();
    e.stopPropagation();
    setDragOverField(fieldKey);
  }, []);

  // 处理拖拽离开
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    console.log('拖拽离开事件触发');
    e.preventDefault();
    e.stopPropagation();
    setDragOverField(null);
  }, []);

  // 移除字段图片
  const removeFieldImage = useCallback((fieldKey: string, imageIndex: number) => {
    setFieldImages(prev => ({
      ...prev,
      [fieldKey]: prev[fieldKey]?.filter((_, index) => index !== imageIndex) || []
    }));
  }, []);

  return (
    <div className={`${styles.detailColumn} ${styles.textColumn}`}>
      <div className={styles.textSection}>
        <h3>基本信息</h3>
        <div className={styles.enhancedTextInfo}>
          {Object.entries(textInfo).map(([key, value]) => {
            // 跳过隐藏字段和内部生成的字段
            if (hiddenFields.includes(key) || internalFields(key)) {
              return null;
            }
            
            const label = getFieldLabel(key);
            const images = fieldImages[key] || [];
            
            return (
              <div key={key} className={styles.enhancedTextItem}>
                <div className={styles.textContent}>
                  <div className={styles.textField}>
                    <label>{label}:</label>
                    <span>
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                </div>
                
                <div 
                  className={`${styles.imageDropZone} ${dragOverField === key ? styles.dragOver : ''}`}
                  onDrop={(e) => {
                    handleDrop(e, key);
                    setDragOverField(null);
                  }}
                  onDragOver={(e) => handleDragOver(e, key)}
                  onDragEnter={(e) => handleDragEnter(e, key)}
                  onDragLeave={handleDragLeave}
                  data-field={key}
                >
                  {images.length > 0 ? (
                    <div className={styles.fieldImages}>
                      {images.map((image, index) => (
                        <div key={index} className={styles.fieldImage}>
                          <img 
                            src={image.url} 
                            alt={image.title || '配图'} 
                            className={styles.fieldImageImg}
                          />
                          <button
                            className={styles.removeImageBtn}
                            onClick={() => removeFieldImage(key, index)}
                            title="移除图片"
                          >
                            ×
                          </button>
                          {image.title && (
                            <div className={styles.imageTitle}>{image.title}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.dropPlaceholder}>
                      <span>{dragOverField === key ? '释放图片' : '拖拽图片到此处'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TextInfoSection;