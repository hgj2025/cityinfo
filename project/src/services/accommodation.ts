import api from './api';
import { PaginationParams, PaginatedResponse } from './city';

// 餐厅相关的类型定义
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  cuisine: string;
  priceRange: string;
  openTime: string;
  contactNumber: string;
  cityId: string;
  city?: {
    name: string;
    nameEn: string;
  };
}

// 酒店相关的类型定义
export interface Hotel {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  priceRange: string;
  rating: number;
  amenities: string[];
  contactNumber: string;
  cityId: string;
  city?: {
    name: string;
    nameEn: string;
  };
}

// 餐厅服务
export const restaurantService = {
  // 获取餐厅列表
  async getRestaurants(params: PaginationParams & {
    cityId?: string;
    cuisine?: string;
    priceRange?: string;
  } = {}): Promise<PaginatedResponse<Restaurant>> {
    const response = await api.get('/restaurants', { params });
    return response.data;
  },

  // 获取餐厅详情
  async getRestaurantById(id: string): Promise<Restaurant> {
    const response = await api.get(`/restaurants/${id}`);
    return response.data.restaurant;
  },
};

// 酒店服务
export const hotelService = {
  // 获取酒店列表
  async getHotels(params: PaginationParams & {
    cityId?: string;
    priceRange?: string;
    rating?: number;
  } = {}): Promise<PaginatedResponse<Hotel>> {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  // 获取酒店详情
  async getHotelById(id: string): Promise<Hotel> {
    const response = await api.get(`/hotels/${id}`);
    return response.data.hotel;
  },
};