import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { HotelController } from '../controllers/hotel.controller';
import { query, param } from 'express-validator';

const router = Router();
const hotelController = new HotelController();

// 验证规则
const listValidation = [
  query('cityId').optional().isString(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('search').optional().isString().trim(),
  query('priceRange').optional().isString().trim(),
  query('rating').optional().isFloat({ min: 0, max: 5 }).toFloat()
];

const idValidation = [
  param('id').isString().notEmpty()
];

// 获取酒店列表
router.get(
  '/',
  listValidation,
  validateRequest,
  hotelController.getHotels
);

// 获取酒店详情
router.get(
  '/:id',
  idValidation,
  validateRequest,
  hotelController.getHotelById
);

export { router as hotelRouter };