// 旅游意向调查表单相关类型定义

export interface TravelPreferences {
  // 基本信息
  travelStyle: string; // 旅行风格：休闲度假、文化探索、冒险刺激、商务出行等
  budgetRange: string; // 预算范围
  travelDuration: string; // 旅行时长
  groupSize: number; // 同行人数
  travelCompanions: string[]; // 同行人类型：家人、朋友、同事、独自一人等
  
  // 目的地偏好
  preferredDestinations: string[]; // 偏好目的地类型
  climatePreference: string; // 气候偏好
  seasonPreference: string[]; // 季节偏好
  domesticVsInternational: string; // 国内外偏好
  
  // 活动偏好
  activityTypes: string[]; // 活动类型偏好
  accommodationType: string; // 住宿类型偏好
  transportationMode: string[]; // 交通方式偏好
  diningPreferences: string[]; // 餐饮偏好
  
  // 特殊需求
  accessibilityNeeds: string[]; // 无障碍需求
  dietaryRestrictions: string[]; // 饮食限制
  languageBarriers: boolean; // 语言障碍担忧
  safetyPriority: number; // 安全优先级（1-5）
  
  // 兴趣标签
  interests: string[]; // 兴趣爱好标签
  
  // 过往经验
  travelExperience: string; // 旅行经验水平
  previousDestinations: string[]; // 曾去过的地方
  
  // 信息获取偏好
  informationSources: string[]; // 信息来源偏好
  bookingPreferences: string[]; // 预订偏好
}

export interface SurveyFormData extends TravelPreferences {
  // 表单元数据
  userId?: string;
  completedAt?: Date;
  lastUpdatedAt?: Date;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
}

export interface SurveyStep {
  id: string;
  title: string;
  description: string;
  fields: SurveyField[];
  isRequired: boolean;
  order: number;
}

export interface SurveyField {
  id: string;
  name: keyof TravelPreferences;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'range' | 'number';
  options?: SurveyOption[];
  placeholder?: string;
  validation?: FieldValidation;
  helpText?: string;
  isRequired: boolean;
}

export interface SurveyOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: any) => string | null;
}

export interface SurveyProgress {
  currentStep: number;
  totalSteps: number;
  completedFields: string[];
  percentage: number;
}

export interface SurveyRecommendation {
  id: string;
  type: 'destination' | 'activity' | 'accommodation' | 'restaurant';
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  price?: string;
  location: string;
  matchScore: number; // 匹配度分数 0-100
  matchReasons: string[]; // 匹配原因
  tags: string[];
}

export interface SurveyResult {
  userId: string;
  preferences: TravelPreferences;
  recommendations: SurveyRecommendation[];
  personalityProfile: TravelPersonalityProfile;
  generatedAt: Date;
}

export interface TravelPersonalityProfile {
  primaryType: string; // 主要旅行者类型
  traits: string[]; // 特征标签
  description: string; // 个性描述
  strengths: string[]; // 优势
  recommendations: string[]; // 建议
}