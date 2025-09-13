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

// 城市服务
export const cityService = {
  // 获取城市列表
  async getCities(params: PaginationParams = {}): Promise<PaginatedResponse<City>> {
    const response = await api.get('/cities', { params });
    return response;
  },

  // 获取城市详情
  async getCityById(id: string): Promise<City> {
    const response = await api.get(`/cities/${id}`);
    return response.data.city;
  },

  // 获取景点列表
  async getAttractions(params: PaginationParams & { cityId?: string } = {}): Promise<PaginatedResponse<Attraction>> {
    const response = await api.get('/attractions', { params });
    return response;
  },

  // 获取景点详情
  async getAttractionById(id: string): Promise<Attraction> {
    const response = await api.get(`/attractions/${id}`);
    return response.data.attraction;
  },
};