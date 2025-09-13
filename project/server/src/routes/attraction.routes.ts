import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { AttractionController } from '../controllers/attraction.controller';
import { query, param } from 'express-validator';

const router = Router();
const attractionController = new AttractionController();

// 验证规则
const listValidation = [
  query('cityId').optional().isString(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('search').optional().isString().trim()
];

const idValidation = [
  param('id').isString().notEmpty()
];

// 获取景点列表
router.get(
  '/',
  listValidation,
  validateRequest,
  attractionController.getAttractions
);

// 获取景点详情
router.get(
  '/:id',
  idValidation,
  validateRequest,
  attractionController.getAttractionById
);

export { router as attractionRouter };