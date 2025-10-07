import { useState, useEffect } from 'react';
import api from '../../../../../services/api';
import { ReviewData } from '../types';
import { extractImages } from '../utils';

export const useReviewData = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        status: 'pending'
      });
      
      // 获取数据审核数据源
      const [dataReviewRes, collectionTaskRes] = await Promise.all([
        api.get(`/admin/reviews?${params}`),
        fetchCollectionTaskReviews(params)
      ]);

      // 整合所有数据
      const allReviews: ReviewData[] = [];
      
      // 处理 DataReview 数据
      if (dataReviewRes.status === 'success' && dataReviewRes.data.reviews) {
        dataReviewRes.data.reviews.forEach((review: any) => {
          allReviews.push({
            ...review,
            source: 'dataReview',
          });
        });
      }

      // 处理 CollectionTask 数据
      collectionTaskRes.forEach((review: ReviewData) => {
        allReviews.push(review);
      });

      // 按时间排序
      allReviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      setReviews(allReviews);
      setTotalPages(Math.ceil(allReviews.length / pageSize));
    } catch (error) {
      console.error('获取审核数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionTaskReviews = async (params: URLSearchParams) => {
    try {
      const tasksData = await api.get(`/admin/data-collection/tasks?${params}`);
      
      if (tasksData.status !== 'success' || !tasksData.data?.tasks) return [];
      
      const completedTasks = tasksData.data.tasks.filter((task: any) => 
        task.status === 'completed' && task.cozeResponse?.data
      );

      const reviews: ReviewData[] = [];
      
      for (const task of completedTasks) {
        if (task.cozeResponse?.data && Array.isArray(task.cozeResponse.data)) {
          task.cozeResponse.data.forEach((item: any, index: number) => {
            reviews.push({
              id: `${task.id}-${index}`,
              taskId: task.id,
              dataType: 'general',
              status: 'pending',
              data: item,
              submittedAt: task.createdAt,
              source: 'collectionTask'
            });
          });
        }
      }
      
      return reviews;
    } catch (error) {
      console.error('获取采集任务审核数据失败:', error);
      return [];
    }
  };

  const handleSelectReview = (review: ReviewData) => {
    // 验证数据完整性
    if (!review) {
      console.error('审核项目为空');
      return;
    }
    
    setSelectedReview(review);
  };

  return {
    reviews,
    loading,
    selectedReview,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSelectReview,
    refreshReviews: fetchReviews
  };
};