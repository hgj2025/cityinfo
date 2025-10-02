import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { CityController } from '../controllers/city.controller';
import { query, param } from 'express-validator';

const router = Router();
const cityController = new CityController();

// 验证规则
const listValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('search').optional().isString().trim()
];

const idValidation = [
  param('id').isString().notEmpty()
];

// 获取城市列表
router.get(
  '/',
  listValidation,
  validateRequest,
  cityController.getCities
);

// 获取城市详情
router.get(
  '/:id',
  idValidation,
  validateRequest,
  cityController.getCityById
);

// 获取城市概览信息
router.get(
  '/:id/overview',
  idValidation,
  validateRequest,
  cityController.getCityOverview
);

// 创建或更新城市概览信息
router.put(
  '/:id/overview',
  idValidation,
  authenticate,
  validateRequest,
  cityController.upsertCityOverview
);

export { router as cityRouter };