import api from './api';

export interface CozeReviewData {
  id: string;
  taskId: string;
  dataType: string;
  status: 'pending' | 'approved' | 'rejected';
  data: {
    name: string;
    description: string;
    content: any;
    images: string[];
  };
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  notes?: string;
}

export interface CozeReviewsResponse {
  reviews: CozeReviewData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewRequest {
  action: 'approve' | 'reject';
  notes?: string;
  selectedImages?: string[];
}

class AdminService {
  /**
   * 获取Coze审核数据列表
   */
  async getCozeReviews(page: number = 1, limit: number = 10): Promise<CozeReviewsResponse> {
    const response = await api.get(`/admin/coze-reviews?page=${page}&limit=${limit}`);
    return response.data;
  }

  /**
   * 审核Coze数据
   */
  async reviewCozeData(reviewId: string, request: ReviewRequest): Promise<{ message: string }> {
    const response = await api.put(`/admin/coze-reviews/${reviewId}`, request);
    return response.data;
  }

  /**
   * 获取仪表板统计数据
   */
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  }

  /**
   * 启动数据采集任务
   */
  async startDataCollection(request: any): Promise<any> {
    const response = await api.post('/admin/data-collection/start', request);
    return response.data;
  }

  /**
   * 获取采集任务列表
   */
  async getCollectionTasks(): Promise<any> {
    const response = await api.get('/admin/data-collection/tasks');
    return response.data;
  }

  /**
   * 获取任务状态
   */
  async getTaskStatus(taskId: string): Promise<any> {
    const response = await api.get(`/admin/data-collection/tasks/${taskId}`);
    return response.data;
  }

  /**
   * 获取任务详情
   */
  async getTaskDetails(taskId: string): Promise<any> {
    const response = await api.get(`/admin/data-collection/tasks/${taskId}/details`);
    return response.data;
  }

  /**
   * 获取待审核数据
   */
  async getPendingReviews(): Promise<any> {
    const response = await api.get('/admin/reviews');
    return response.data;
  }

  /**
   * 审核数据
   */
  async reviewData(reviewId: string, request: any): Promise<any> {
    const response = await api.post(`/admin/reviews/${reviewId}`, request);
    return response.data;
  }

  /**
   * 获取采集任务的审核数据
   */
  async getCollectionTaskReviews(taskId: string, page: number = 1, limit: number = 10): Promise<CozeReviewsResponse> {
    const response = await api.get(`/admin/collection-tasks/${taskId}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  }
}

export const adminService = new AdminService();