import api from './api';

// 城市相关的类型定义
export interface City {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  location: string;
}

export interface Attraction {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  location: string;
  price: number;
  openTime: string;
  cityId: string;
  city?: {
    name: string;
    nameEn: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: {
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// 城市概览相关类型定义
export interface CityOverview {
  id: string;
  cityId: string;
  city: {
    id: string;
    name: string;
  };
  history: {
    title: string;
    content: string;
    image?: string;
  };
  culture: {
    title: string;
    content: string;
    image?: string;
  };
  customs: {
    title: string;
    content: string;
    image?: string;
  };
  heritageItems: Array<{
    name: string;
    description: string;
  }>;
  festivals: Array<{
    name: string;
    time: string;
    activities: string;
  }>;
  historicalStories: Array<{
    title: string;
    content: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// 城市服务
export const cityService = {
  // 获取城市列表
  async getCities(params: PaginationParams = {}): Promise<PaginatedResponse<City>> {
    const response = await api.get('/cities', { params });
    // API返回的数据结构：{status: 'success', data: {cities: [...], pagination: {...}}}
    // axios拦截器已经提取了data，所以response就是API的响应体
    // 需要转换为PaginatedResponse格式：{status: string, data: {items: [...], pagination: {...}}}
    return {
      status: response.status,
      data: {
        items: response.data.cities,
        pagination: response.data.pagination
      }
    };
  },

  // 获取城市详情
  async getCityById(id: string): Promise<City> {
    const response = await api.get(`/cities/${id}`);
    return response.data.city;
  },

  // 获取景点列表
  async getAttractions(params: PaginationParams & { cityId?: string } = {}): Promise<PaginatedResponse<Attraction>> {
    const response = await api.get('/attractions', { params });
    return {
      status: response.status,
      data: {
        items: response.data.attractions,
        pagination: response.data.pagination
      }
    };
  },

  // 获取景点详情
  async getAttractionById(id: string): Promise<Attraction> {
    const response = await api.get(`/attractions/${id}`);
    return response.data.attraction;
  },

  // 获取城市概览
  async getCityOverview(id: string): Promise<CityOverview> {
    const response = await api.get(`/cities/${id}/overview`);
    return response.data.overview;
  },
};