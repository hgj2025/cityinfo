import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// API基础配置
const API_BASE_URL = 'http://localhost:3001/api/v1';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      // 处理401未授权错误
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // 处理其他错误
      const errorMessage = (error.response.data as any)?.message || '请求失败';
      console.error(`[API Error] ${errorMessage}`);
    } else if (error.request) {
      console.error('[API Error] 网络请求失败');
    } else {
      console.error(`[API Error] ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;