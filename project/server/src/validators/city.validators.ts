import { body } from 'express-validator';

// 初始化城市概览数据验证
export const initializeCityOverviewValidation = [
  body('city')
    .notEmpty()
    .withMessage('城市名称不能为空')
    .isString()
    .withMessage('城市名称必须是字符串')
    .trim(),
    
  body('content')
    .notEmpty()
    .withMessage('内容数据不能为空')
    .custom((value) => {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        
        // 验证必需的数据结构
        if (!parsed.history || typeof parsed.history !== 'object') {
          throw new Error('缺少历史沿革数据');
        }
        
        if (!parsed.culture || typeof parsed.culture !== 'object') {
          throw new Error('缺少文化特色数据');
        }
        
        if (!parsed.tradition || typeof parsed.tradition !== 'object') {
          throw new Error('缺少风俗习惯数据');
        }
        
        if (!Array.isArray(parsed.art)) {
          throw new Error('艺术与非物质文化遗产数据必须是数组');
        }
        
        if (!Array.isArray(parsed.activity)) {
          throw new Error('节庆活动数据必须是数组');
        }
        
        if (!Array.isArray(parsed.hero)) {
          throw new Error('名人与历史故事数据必须是数组');
        }
        
        return true;
      } catch (error) {
        throw new Error(`内容数据格式错误: ${error instanceof Error ? error.message : String(error)}`);
      }
    }),
    
  body('pictureAdvises')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          return true; // 允许单个字符串
        }
      }
      return false;
    })
    .withMessage('图片建议必须是数组或JSON字符串'),
    
  body('pictures')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          return true; // 允许单个字符串
        }
      }
      return false;
    })
    .withMessage('图片数据必须是数组或JSON字符串')
];

// 验证艺术项目数据结构
const validateArtItem = (item: any) => {
  if (!item.itemName || typeof item.itemName !== 'string') {
    throw new Error('艺术项目缺少名称');
  }
  if (!item.desc || typeof item.desc !== 'string') {
    throw new Error('艺术项目缺少描述');
  }
  if (!item.history || typeof item.history !== 'string') {
    throw new Error('艺术项目缺少历史背景');
  }
};

// 验证节庆活动数据结构
const validateActivityItem = (item: any) => {
  if (!item.activityName || typeof item.activityName !== 'string') {
    throw new Error('节庆活动缺少名称');
  }
  if (!item.activityTime || typeof item.activityTime !== 'string') {
    throw new Error('节庆活动缺少时间');
  }
  if (!item.activityContent || typeof item.activityContent !== 'string') {
    throw new Error('节庆活动缺少内容描述');
  }
};

// 验证历史人物数据结构
const validateHeroItem = (item: any) => {
  if (!item.name || typeof item.name !== 'string') {
    throw new Error('历史人物缺少姓名');
  }
  if (!item.desc || typeof item.desc !== 'string') {
    throw new Error('历史人物缺少描述');
  }
  if (!item.story || typeof item.story !== 'string') {
    throw new Error('历史人物缺少故事');
  }
};