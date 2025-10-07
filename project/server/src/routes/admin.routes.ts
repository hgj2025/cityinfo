import { Router } from 'express';
import {
  getDashboardStats,
  startDataCollection,
  getCollectionTasks,
  getTaskStatus,
  getTaskDetails,
  deleteCollectionTask,
  getPendingReviews,
  reviewData,
  getCozeReviews,
  reviewCozeData,
  getCollectionTaskReviews
} from '../controllers/admin.controller';

const router = Router();

// 仪表板统计数据
router.get('/dashboard/stats', getDashboardStats);

// 数据采集相关
router.post('/data-collection/start', startDataCollection);
router.get('/data-collection/tasks', getCollectionTasks);
router.get('/data-collection/tasks/:taskId', getTaskStatus);
router.get('/data-collection/tasks/:taskId/details', getTaskDetails);
router.delete('/data-collection/tasks/:taskId', deleteCollectionTask);

// 数据审核相关
router.get('/reviews', getPendingReviews);
router.post('/reviews/:reviewId', reviewData);

// Coze数据审核相关
router.get('/coze-reviews', getCozeReviews);
router.put('/coze-reviews/:reviewId', reviewCozeData);

// 采集任务审核数据
router.get('/collection-tasks/:taskId/reviews', getCollectionTaskReviews);

export default router;