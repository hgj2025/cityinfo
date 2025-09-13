import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { RestaurantController } from '../controllers/restaurant.controller';
import { query, param } from 'express-validator';

const router = Router();
const restaurantController = new RestaurantController();

// 验证规则
const listValidation = [
  query('cityId').optional().isString(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('search').optional().isString().trim(),
  query('cuisine').optional().isString().trim(),
  query('priceRange').optional().isString().trim()
];

const idValidation = [
  param('id').isString().notEmpty()
];

// 获取餐厅列表
router.get(
  '/',
  listValidation,
  validateRequest,
  restaurantController.getRestaurants
);

// 获取餐厅详情
router.get(
  '/:id',
  idValidation,
  validateRequest,
  restaurantController.getRestaurantById
);

export { router as restaurantRouter };