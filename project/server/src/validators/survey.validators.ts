import { body, param, query } from 'express-validator';

// 创建调查响应验证规则
export const createSurveyValidation = [
  body('travelStyle')
    .optional()
    .isString()
    .withMessage('旅行风格必须是字符串'),
    
  body('budgetRange')
    .optional()
    .isString()
    .withMessage('预算范围必须是字符串'),
    
  body('travelDuration')
    .optional()
    .isString()
    .withMessage('旅行时长必须是字符串'),
    
  body('groupSize')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('同行人数必须是1-50之间的整数'),
    
  body('travelCompanions')
    .optional()
    .isArray()
    .withMessage('同行人类型必须是数组'),
    
  body('preferredDestinations')
    .optional()
    .isArray()
    .withMessage('偏好目的地必须是数组'),
    
  body('climatePreference')
    .optional()
    .isString()
    .withMessage('气候偏好必须是字符串'),
    
  body('seasonPreference')
    .optional()
    .isArray()
    .withMessage('季节偏好必须是数组'),
    
  body('domesticVsInternational')
    .optional()
    .isString()
    .withMessage('国内外偏好必须是字符串'),
    
  body('activityTypes')
    .optional()
    .isArray()
    .withMessage('活动类型必须是数组'),
    
  body('accommodationType')
    .optional()
    .isString()
    .withMessage('住宿类型必须是字符串'),
    
  body('transportationMode')
    .optional()
    .isArray()
    .withMessage('交通方式必须是数组'),
    
  body('diningPreferences')
    .optional()
    .isArray()
    .withMessage('餐饮偏好必须是数组'),
    
  body('accessibilityNeeds')
    .optional()
    .isArray()
    .withMessage('无障碍需求必须是数组'),
    
  body('dietaryRestrictions')
    .optional()
    .isArray()
    .withMessage('饮食限制必须是数组'),
    
  body('languageBarriers')
    .optional()
    .isBoolean()
    .withMessage('语言障碍必须是布尔值'),
    
  body('safetyPriority')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('安全优先级必须是1-5之间的整数'),
    
  body('interests')
    .optional()
    .isArray()
    .withMessage('兴趣爱好必须是数组'),
    
  body('travelExperience')
    .optional()
    .isString()
    .withMessage('旅行经验必须是字符串'),
    
  body('previousDestinations')
    .optional()
    .isArray()
    .withMessage('曾去过的地方必须是数组'),
    
  body('informationSources')
    .optional()
    .isArray()
    .withMessage('信息来源必须是数组'),
    
  body('bookingPreferences')
    .optional()
    .isArray()
    .withMessage('预订偏好必须是数组'),
    
  body('currentStep')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('当前步骤必须是1-10之间的整数'),
    
  body('totalSteps')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('总步骤必须是1-10之间的整数'),
    
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('完成状态必须是布尔值')
];

// 更新调查响应验证规则
export const updateSurveyValidation = [
  param('surveyId')
    .isString()
    .withMessage('调查ID必须是字符串'),
    
  ...createSurveyValidation
];

// 获取调查响应验证规则
export const getSurveyValidation = [
  param('surveyId')
    .isString()
    .withMessage('调查ID必须是字符串')
];

// 提交调查响应验证规则
export const submitSurveyValidation = [
  param('surveyId')
    .isString()
    .withMessage('调查ID必须是字符串'),
    
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('完成状态必须是布尔值')
];

// 自动保存验证规则
export const autoSaveValidation = [
  param('surveyId')
    .isString()
    .withMessage('调查ID必须是字符串'),
    
  body('currentStep')
    .isInt({ min: 1, max: 10 })
    .withMessage('当前步骤必须是1-10之间的整数'),
    
  body('data')
    .isObject()
    .withMessage('数据必须是对象')
];

// 查询参数验证
export const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是大于0的整数'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须是1-100之间的整数'),
    
  query('status')
    .optional()
    .isIn(['draft', 'in_progress', 'completed'])
    .withMessage('状态必须是有效选项')
];