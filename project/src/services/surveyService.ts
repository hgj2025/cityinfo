import axios from 'axios';
import { SurveyFormData, TravelPreferences } from '../types/survey';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface SurveyResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface CreateSurveyRequest extends Partial<TravelPreferences> {
  currentStep?: number;
  totalSteps?: number;
  isCompleted?: boolean;
}

export interface UpdateSurveyRequest extends Partial<TravelPreferences> {
  currentStep?: number;
  isCompleted?: boolean;
}

export interface AutoSaveRequest {
  currentStep: number;
  data: Partial<TravelPreferences>;
}

class SurveyService {
  /**
   * 创建新的调查响应
   */
  async createSurvey(data: CreateSurveyRequest): Promise<SurveyResponse> {
    try {
      const response = await api.post('/survey', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '创建调查失败');
    }
  }

  /**
   * 获取调查响应
   */
  async getSurvey(surveyId: string): Promise<SurveyResponse> {
    try {
      const response = await api.get(`/survey/${surveyId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '获取调查失败');
    }
  }

  /**
   * 获取用户最新的调查响应
   */
  async getUserLatestSurvey(): Promise<SurveyResponse> {
    try {
      const response = await api.get('/survey/user/latest');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { success: false, data: null };
      }
      throw new Error(error.response?.data?.error || '获取用户调查失败');
    }
  }

  /**
   * 更新调查响应
   */
  async updateSurvey(surveyId: string, data: UpdateSurveyRequest): Promise<SurveyResponse> {
    try {
      const response = await api.put(`/survey/${surveyId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '更新调查失败');
    }
  }

  /**
   * 自动保存调查进度
   */
  async autoSaveSurvey(surveyId: string, data: AutoSaveRequest): Promise<SurveyResponse> {
    try {
      const response = await api.post(`/survey/${surveyId}/autosave`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '自动保存失败');
    }
  }

  /**
   * 提交完整的调查响应
   */
  async submitSurvey(surveyId: string, data: SurveyFormData): Promise<SurveyResponse> {
    try {
      const response = await api.post(`/survey/${surveyId}/submit`, {
        ...data,
        isCompleted: true,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '提交调查失败');
    }
  }

  /**
   * 获取调查统计信息（管理员功能）
   */
  async getSurveyStats(): Promise<SurveyResponse> {
    try {
      const response = await api.get('/survey/admin/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '获取统计信息失败');
    }
  }
}

// 导出单例实例
export const surveyService = new SurveyService();
export default surveyService;