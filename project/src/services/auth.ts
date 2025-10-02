import api from './api';

// 用户认证相关的类型定义
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  nationality?: string;
  languagePreference?: string;
  ageGroup?: string;
  phoneNumber?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  nationality?: string;
  languagePreference?: string;
  ageGroup?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: UserProfile;
    token: string;
  };
  token?: string;
}

// 认证服务
export const authService = {
  // 用户登录
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // 用户注册
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // 获取用户信息
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/profile');
    return response.data.user;
  },

  // 更新用户资料
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put('/auth/profile', data);
    return response.data.user;
  },

  // 退出登录
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};