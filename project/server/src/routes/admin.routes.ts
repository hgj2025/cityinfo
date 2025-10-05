import { Router } from 'express';
import {
  getDashboardStats,
  startDataCollection,
  getCollectionTasks,
  getTaskStatus,
  getTaskDetails,
  getPendingReviews,
  reviewData
} from '../controllers/admin.controller';

const router = Router();

// 仪表板统计数据
router.get('/dashboard/stats', getDashboardStats);

// 数据采集相关
router.post('/data-collection/start', startDataCollection);
router.get('/data-collection/tasks', getCollectionTasks);
router.get('/data-collection/tasks/:taskId', getTaskStatus);
router.get('/data-collection/tasks/:taskId/details', getTaskDetails);

// 数据审核相关
router.get('/reviews', getPendingReviews);
router.post('/reviews/:reviewId', reviewData);

export default router;