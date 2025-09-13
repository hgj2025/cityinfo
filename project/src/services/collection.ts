import api from './api';
import { PaginationParams, PaginatedResponse } from './city';

// 收藏相关的类型定义
export type CollectionItemType = 'attraction' | 'restaurant' | 'hotel';

export interface Collection {
  id: string;
  itemType: CollectionItemType;
  item: {
    id: string;
    name: string;
    image: string;
    description: string;
  };
  createdAt: string;
}

// 搜索相关的类型定义
export interface SearchResult {
  type: CollectionItemType | 'city';
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  image: string;
}

// 收藏服务
export const collectionService = {
  // 添加收藏
  async addCollection(itemType: CollectionItemType, itemId: string): Promise<Collection> {
    const response = await api.post('/collections', { itemType, itemId });
    return response.data.collection;
  },

  // 获取收藏列表
  async getCollections(params: PaginationParams & {
    itemType?: CollectionItemType;
  } = {}): Promise<PaginatedResponse<Collection>> {
    const response = await api.get('/collections', { params });
    return response;
  },

  // 删除收藏
  async deleteCollection(id: string): Promise<void> {
    await api.delete(`/collections/${id}`);
  },

  // 检查是否已收藏
  async checkCollection(itemType: CollectionItemType, itemId: string): Promise<boolean> {
    try {
      const response = await api.get(`/collections/check`, {
        params: { itemType, itemId }
      });
      return response.data.collected;
    } catch {
      return false;
    }
  },
};

// 搜索服务
export const searchService = {
  // 全局搜索
  async search(params: PaginationParams & {
    keyword: string;
    type?: CollectionItemType | 'city';
  }): Promise<PaginatedResponse<SearchResult>> {
    const response = await api.get('/search', { params });
    return response;
  },
};