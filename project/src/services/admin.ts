import api from './api';



export interface ReviewRequest {
  action: 'approve' | 'reject';
  notes?: string;
  selectedImages?: string[];
}

class AdminService {


  /**
   * 获取仪表板统计数据
   */
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/admin/dashboard/stats');
    return response;
  }

  /**
   * 启动数据采集任务
   */
  async startDataCollection(request: any): Promise<any> {
    const response = await api.post('/admin/data-collection/start', request);
    return response;
  }

  /**
   * 获取采集任务列表
   */
  async getCollectionTasks(): Promise<any> {
    const response = await api.get('/admin/data-collection/tasks');
    return response;
  }

  /**
   * 获取任务状态
   */
  async getTaskStatus(taskId: string): Promise<any> {
    const response = await api.get(`/admin/data-collection/tasks/${taskId}`);
    return response;
  }

  /**
   * 获取任务详情
   */
  async getTaskDetails(taskId: string): Promise<any> {
    const response = await api.get(`/admin/data-collection/tasks/${taskId}/details`);
    return response;
  }

  /**
   * 获取待审核数据
   */
  async getPendingReviews(): Promise<any> {
    const response = await api.get('/admin/reviews');
    return response;
  }

  /**
   * 审核数据
   */
  async reviewData(reviewId: string, request: any): Promise<any> {
    const response = await api.post(`/admin/reviews/${reviewId}`, request);
    return response;
  }

  /**
   * 获取采集任务的审核数据
   */
  async getCollectionTaskReviews(taskId: string, page: number = 1, limit: number = 10): Promise<any> {
    const response = await api.get(`/admin/collection-tasks/${taskId}/reviews?page=${page}&limit=${limit}`);
    return response;
  }

  // Coze审核相关方法（占位符）
  async getCozeReviews(page: number = 1, limit: number = 10) {
    // TODO: 实现coze审核数据获取
    return {
      reviews: [],
      totalPages: 0,
      total: 0
    };
  }

  async reviewCozeData(reviewId: string, request: any) {
    // TODO: 实现coze数据审核
    return { status: 'success', message: '功能暂未实现' };
  }
}

export const adminService = new AdminService();