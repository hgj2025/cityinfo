import { ImageGroup } from './types';

export const isValidImageUrl = (url: string): boolean => {
  return url.includes('http') || url.includes('data:image') || 
         url.includes('.jpg') || url.includes('.png') || 
         url.includes('.jpeg') || url.includes('.gif') || 
         url.includes('.webp');
};

export const extractImages = (data: any): ImageGroup[] => {
  if (!data || typeof data !== 'object') return [];
  
  const groups: ImageGroup[] = [];
  
  // 检查常见的图片字段
  const imageFields = ['images', 'pictures', 'pictureAdvises', 'image'];
  
  imageFields.forEach(fieldName => {
    if (data[fieldName]) {
      let images: string[] = [];
      
      if (Array.isArray(data[fieldName])) {
        images = data[fieldName].filter((item: any) => {
          if (typeof item === 'string') {
            return isValidImageUrl(item);
          }
          return false;
        });
      } else if (typeof data[fieldName] === 'string' && isValidImageUrl(data[fieldName])) {
        images = [data[fieldName]];
      }
      
      if (images.length > 0) {
        const title = fieldName === 'images' ? '主要图片' : 
                     fieldName === 'pictures' ? '相关图片' : 
                     fieldName === 'pictureAdvises' ? '推荐图片' :
                     fieldName === 'image' ? '封面图片' : fieldName;
        groups.push({ title, images });
      }
    }
  });

  // 递归查找其他可能的图片字段
  const findImages = (obj: any, path: string = '') => {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'string' && isValidImageUrl(item)) {
          const title = path || `其他图片 ${groups.length + 1}`;
          let group = groups.find(g => g.title === title);
          if (!group) {
            group = { title, images: [] };
            groups.push(group);
          }
          if (!group.images.includes(item)) {
            group.images.push(item);
          }
        } else if (typeof item === 'object' && item !== null) {
          findImages(item, path || `项目 ${index + 1}`);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        // 跳过已经处理过的字段
        if (imageFields.includes(key)) return;
        
        if (typeof value === 'string' && isValidImageUrl(value)) {
          const title = path ? `${path} - ${key}` : key;
          let group = groups.find(g => g.title === title);
          if (!group) {
            group = { title, images: [] };
            groups.push(group);
          }
          if (!group.images.includes(value)) {
            group.images.push(value);
          }
        } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          findImages(value, path ? `${path} - ${key}` : key);
        }
      });
    }
  };

  // 只对非标准字段进行递归搜索
  const remainingData = { ...data };
  imageFields.forEach(field => delete remainingData[field]);
  findImages(remainingData);
  
  return groups;
};

export const extractTextInfo = (data: any) => {
  if (!data || typeof data !== 'object') {
    return {};
  }
  
  const textInfo: Record<string, any> = {};
  const imageFields = ['images', 'pictures', 'image'];
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' && !isValidImageUrl(value)) {
        textInfo[key] = value;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        textInfo[key] = value;
      } else if (Array.isArray(value)) {
        // 对于数组，区分图片数组和文本数组
        if (key === 'pictureAdvises' || key.toLowerCase().includes('advise')) {
          // 图片建议数组，显示数量和前几项
          textInfo[key] = value;
          textInfo[`${key}_count`] = value.length;
          textInfo[`${key}_preview`] = value.slice(0, 3).join('; ') + (value.length > 3 ? '...' : '');
        } else if (value.every(item => typeof item === 'string' && !isValidImageUrl(item))) {
          textInfo[key] = value;
        }
      } else if (typeof value === 'object' && !imageFields.includes(key)) {
        // 递归处理嵌套对象
        if (key === 'tradition' && value) {
          // 特殊处理tradition对象
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subKey !== 'pictureAdvise' && subValue) {
              textInfo[`${key}.${subKey}`] = subValue;
            }
          });
        } else {
          // 一般嵌套对象处理
          const nestedInfo = extractTextInfo(value);
          Object.entries(nestedInfo).forEach(([nestedKey, nestedValue]) => {
            textInfo[`${key}.${nestedKey}`] = nestedValue;
          });
        }
      }
    }
  });
  
  return textInfo;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

export const getFieldLabel = (key: string): string => {
  const fieldLabels: Record<string, string> = {
    'city': '城市',
    'location': '位置',
    'name': '名称',
    'title': '标题',
    'description': '描述',
    'type': '类型',
    'category': '分类',
    'address': '地址',
    'phone': '电话',
    'website': '网站',
    'rating': '评分',
    'price': '价格',
    'openTime': '开放时间',
    'tags': '标签',
    'culture': '文化',
    'history': '历史',
    'art': '艺术',
    'hero': '英雄人物',
    'activity': '活动',
    'tradition.food': '传统美食',
    'tradition.daily': '日常生活',
    'tradition.bigday': '重要节日',
    'tradition.tradition': '传统习俗'
  };
  
  return fieldLabels[key] || key;
};