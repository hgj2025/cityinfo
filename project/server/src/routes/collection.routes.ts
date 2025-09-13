import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { CollectionController } from '../controllers/collection.controller';
import { body, query } from 'express-validator';

const router = Router();
const collectionController = new CollectionController();

// 验证规则
const createValidation = [
  body('itemType').isIn(['attraction', 'restaurant', 'hotel']).withMessage('无效的收藏类型'),
  body('itemId').isString().notEmpty().withMessage('项目ID不能为空')
];

const listValidation = [
  query('itemType').optional().isIn(['attraction', 'restaurant', 'hotel']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
];

// 添加收藏
router.post(
  '/',
  authenticate,
  createValidation,
  validateRequest,
  collectionController.addCollection
);

// 获取用户收藏列表
router.get(
  '/',
  authenticate,
  listValidation,
  validateRequest,
  collectionController.getCollections
);

// 删除收藏
router.delete(
  '/:id',
  authenticate,
  collectionController.removeCollection
);

// 检查是否已收藏
router.get(
  '/check',
  authenticate,
  createValidation,
  validateRequest,
  collectionController.checkCollection
);

export { router as collectionRouter };