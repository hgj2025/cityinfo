import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { SearchController } from '../controllers/search.controller';
import { query } from 'express-validator';

const router = Router();
const searchController = new SearchController();

// 验证规则
const searchValidation = [
  query('keyword').isString().notEmpty().withMessage('搜索关键词不能为空'),
  query('type').optional().isIn(['city', 'attraction', 'restaurant', 'hotel']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
];

// 全局搜索
router.get(
  '/',
  searchValidation,
  validateRequest,
  searchController.search
);

export { router as searchRouter };