import { SurveyStep, SurveyOption } from '../types/survey';

// 旅行风格选项
const travelStyleOptions: SurveyOption[] = [
  { value: 'leisure', label: '休闲度假', icon: '🏖️', description: '放松身心，享受悠闲时光' },
  { value: 'cultural', label: '文化探索', icon: '🏛️', description: '深入了解当地历史文化' },
  { value: 'adventure', label: '冒险刺激', icon: '🏔️', description: '寻求刺激和挑战体验' },
  { value: 'business', label: '商务出行', icon: '💼', description: '工作与旅行相结合' },
  { value: 'romantic', label: '浪漫之旅', icon: '💕', description: '情侣或夫妻的浪漫旅程' },
  { value: 'family', label: '家庭出游', icon: '👨‍👩‍👧‍👦', description: '适合全家人的旅行' }
];

// 预算范围选项
const budgetRangeOptions: SurveyOption[] = [
  { value: 'budget', label: '经济型 (< ¥3000)', icon: '💰' },
  { value: 'mid-range', label: '中等 (¥3000-8000)', icon: '💳' },
  { value: 'luxury', label: '豪华 (¥8000-20000)', icon: '💎' },
  { value: 'ultra-luxury', label: '超豪华 (> ¥20000)', icon: '👑' }
];

// 旅行时长选项
const travelDurationOptions: SurveyOption[] = [
  { value: '1-2days', label: '1-2天', description: '周末短途游' },
  { value: '3-5days', label: '3-5天', description: '小长假出行' },
  { value: '1week', label: '1周', description: '深度体验' },
  { value: '2weeks', label: '2周', description: '充分探索' },
  { value: 'month+', label: '1个月以上', description: '长期旅居' }
];

// 同行人类型选项
const travelCompanionsOptions: SurveyOption[] = [
  { value: 'solo', label: '独自一人', icon: '🚶' },
  { value: 'partner', label: '伴侣/配偶', icon: '💑' },
  { value: 'family', label: '家人', icon: '👨‍👩‍👧‍👦' },
  { value: 'friends', label: '朋友', icon: '👥' },
  { value: 'colleagues', label: '同事', icon: '👔' },
  { value: 'group', label: '旅行团', icon: '🚌' }
];

// 目的地类型选项
const destinationTypeOptions: SurveyOption[] = [
  { value: 'beach', label: '海滨度假', icon: '🏖️' },
  { value: 'mountain', label: '山地自然', icon: '⛰️' },
  { value: 'city', label: '都市风光', icon: '🏙️' },
  { value: 'historical', label: '历史古迹', icon: '🏛️' },
  { value: 'countryside', label: '乡村田园', icon: '🌾' },
  { value: 'island', label: '海岛风情', icon: '🏝️' },
  { value: 'desert', label: '沙漠奇观', icon: '🏜️' },
  { value: 'forest', label: '森林探秘', icon: '🌲' }
];

// 气候偏好选项
const climatePreferenceOptions: SurveyOption[] = [
  { value: 'tropical', label: '热带气候', description: '温暖湿润，四季如夏' },
  { value: 'temperate', label: '温带气候', description: '四季分明，气候宜人' },
  { value: 'cold', label: '寒带气候', description: '凉爽干燥，适合避暑' },
  { value: 'mediterranean', label: '地中海气候', description: '温和舒适，阳光充足' },
  { value: 'no-preference', label: '无特别偏好', description: '适应各种气候条件' }
];

// 活动类型选项
const activityTypeOptions: SurveyOption[] = [
  { value: 'sightseeing', label: '观光游览', icon: '📸' },
  { value: 'outdoor', label: '户外运动', icon: '🚴' },
  { value: 'cultural', label: '文化体验', icon: '🎭' },
  { value: 'food', label: '美食探索', icon: '🍜' },
  { value: 'shopping', label: '购物血拼', icon: '🛍️' },
  { value: 'nightlife', label: '夜生活', icon: '🌃' },
  { value: 'wellness', label: '健康养生', icon: '🧘' },
  { value: 'photography', label: '摄影创作', icon: '📷' }
];

// 住宿类型选项
const accommodationTypeOptions: SurveyOption[] = [
  { value: 'hotel', label: '星级酒店', icon: '🏨' },
  { value: 'boutique', label: '精品酒店', icon: '🏛️' },
  { value: 'resort', label: '度假村', icon: '🏖️' },
  { value: 'hostel', label: '青年旅社', icon: '🏠' },
  { value: 'bnb', label: '民宿/B&B', icon: '🏡' },
  { value: 'apartment', label: '公寓式酒店', icon: '🏢' },
  { value: 'camping', label: '露营/帐篷', icon: '⛺' }
];

// 交通方式选项
const transportationOptions: SurveyOption[] = [
  { value: 'flight', label: '飞机', icon: '✈️' },
  { value: 'train', label: '火车/高铁', icon: '🚄' },
  { value: 'car', label: '自驾车', icon: '🚗' },
  { value: 'bus', label: '长途巴士', icon: '🚌' },
  { value: 'cruise', label: '邮轮', icon: '🚢' },
  { value: 'local-transport', label: '当地交通', icon: '🚇' }
];

// 兴趣爱好选项
const interestOptions: SurveyOption[] = [
  { value: 'history', label: '历史文化', icon: '📚' },
  { value: 'art', label: '艺术设计', icon: '🎨' },
  { value: 'music', label: '音乐演出', icon: '🎵' },
  { value: 'sports', label: '体育运动', icon: '⚽' },
  { value: 'nature', label: '自然生态', icon: '🌿' },
  { value: 'technology', label: '科技创新', icon: '💻' },
  { value: 'fashion', label: '时尚潮流', icon: '👗' },
  { value: 'architecture', label: '建筑设计', icon: '🏗️' }
];

// 调查表单步骤配置
export const surveySteps: SurveyStep[] = [
  {
    id: 'basic-info',
    title: '基本信息',
    description: '告诉我们您的基本旅行偏好',
    order: 1,
    isRequired: true,
    fields: [
      {
        id: 'travel-style',
        name: 'travelStyle',
        label: '您偏好的旅行风格是？',
        type: 'radio',
        options: travelStyleOptions,
        isRequired: true,
        helpText: '选择最符合您旅行期望的风格'
      },
      {
        id: 'budget-range',
        name: 'budgetRange',
        label: '您的预算范围是？',
        type: 'radio',
        options: budgetRangeOptions,
        isRequired: true,
        helpText: '请选择您单次旅行的预算范围'
      },
      {
        id: 'travel-duration',
        name: 'travelDuration',
        label: '您通常的旅行时长？',
        type: 'radio',
        options: travelDurationOptions,
        isRequired: true
      },
      {
        id: 'group-size',
        name: 'groupSize',
        label: '同行人数（包括您自己）',
        type: 'number',
        isRequired: true,
        validation: { min: 1, max: 20 },
        placeholder: '请输入人数'
      }
    ]
  },
  {
    id: 'companions-preferences',
    title: '同行偏好',
    description: '了解您的旅行伙伴情况',
    order: 2,
    isRequired: true,
    fields: [
      {
        id: 'travel-companions',
        name: 'travelCompanions',
        label: '您通常与谁一起旅行？',
        type: 'multiselect',
        options: travelCompanionsOptions,
        isRequired: true,
        helpText: '可以选择多个选项'
      }
    ]
  },
  {
    id: 'destination-preferences',
    title: '目的地偏好',
    description: '告诉我们您理想的目的地类型',
    order: 3,
    isRequired: true,
    fields: [
      {
        id: 'preferred-destinations',
        name: 'preferredDestinations',
        label: '您偏好的目的地类型？',
        type: 'multiselect',
        options: destinationTypeOptions,
        isRequired: true,
        helpText: '可以选择多个类型'
      },
      {
        id: 'climate-preference',
        name: 'climatePreference',
        label: '您偏好的气候类型？',
        type: 'radio',
        options: climatePreferenceOptions,
        isRequired: true
      },
      {
        id: 'domestic-vs-international',
        name: 'domesticVsInternational',
        label: '您更偏好国内还是国外旅行？',
        type: 'radio',
        options: [
          { value: 'domestic', label: '国内旅行', description: '探索祖国大好河山' },
          { value: 'international', label: '国外旅行', description: '体验异国风情文化' },
          { value: 'both', label: '都喜欢', description: '国内外都有兴趣' }
        ],
        isRequired: true
      }
    ]
  },
  {
    id: 'activity-preferences',
    title: '活动偏好',
    description: '选择您在旅行中喜欢的活动类型',
    order: 4,
    isRequired: true,
    fields: [
      {
        id: 'activity-types',
        name: 'activityTypes',
        label: '您喜欢的旅行活动类型？',
        type: 'multiselect',
        options: activityTypeOptions,
        isRequired: true,
        helpText: '选择您感兴趣的活动类型'
      },
      {
        id: 'accommodation-type',
        name: 'accommodationType',
        label: '您偏好的住宿类型？',
        type: 'radio',
        options: accommodationTypeOptions,
        isRequired: true
      },
      {
        id: 'transportation-mode',
        name: 'transportationMode',
        label: '您偏好的交通方式？',
        type: 'multiselect',
        options: transportationOptions,
        isRequired: true
      }
    ]
  },
  {
    id: 'interests-experience',
    title: '兴趣与经验',
    description: '了解您的兴趣爱好和旅行经验',
    order: 5,
    isRequired: false,
    fields: [
      {
        id: 'interests',
        name: 'interests',
        label: '您的兴趣爱好？',
        type: 'multiselect',
        options: interestOptions,
        isRequired: false,
        helpText: '选择您感兴趣的领域'
      },
      {
        id: 'travel-experience',
        name: 'travelExperience',
        label: '您的旅行经验水平？',
        type: 'radio',
        options: [
          { value: 'beginner', label: '初学者', description: '很少出门旅行' },
          { value: 'intermediate', label: '中等水平', description: '有一些旅行经验' },
          { value: 'experienced', label: '经验丰富', description: '经常旅行，经验丰富' },
          { value: 'expert', label: '旅行达人', description: '资深旅行者，去过很多地方' }
        ],
        isRequired: false
      },
      {
        id: 'safety-priority',
        name: 'safetyPriority',
        label: '安全对您的重要程度？',
        type: 'range',
        isRequired: false,
        validation: { min: 1, max: 5 },
        helpText: '1=不太重要，5=非常重要'
      }
    ]
  }
];

export const getTotalSteps = (): number => surveySteps.length;

export const getStepById = (stepId: string): SurveyStep | undefined => {
  return surveySteps.find(step => step.id === stepId);
};

export const getStepByOrder = (order: number): SurveyStep | undefined => {
  return surveySteps.find(step => step.order === order);
};