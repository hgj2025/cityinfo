import { Router } from 'express';
import {
  createSurveyResponse,
  getUserSurveyResponse,
  updateSurveyResponse,
  submitSurveyResponse,
  deleteSurveyResponse,
  getSurveyStats,
  autoSaveSurveyProgress
} from '../controllers/survey.controller';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  createSurveyValidation,
  updateSurveyValidation,
  getSurveyValidation,
  submitSurveyValidation,
  autoSaveValidation,
  queryValidation
} from '../validators/survey.validators';

const router = Router();

// 公开路由（不需要认证）
// 创建新的调查响应（支持匿名用户）
router.post('/', createSurveyValidation, validateRequest, createSurveyResponse);

// 通过ID获取调查响应（支持匿名访问）
router.get('/:surveyId', getSurveyValidation, validateRequest, getUserSurveyResponse);

// 更新调查响应（支持匿名用户）
router.put('/:surveyId', updateSurveyValidation, validateRequest, updateSurveyResponse);

// 提交完整调查响应
router.post('/:surveyId/submit', (req, res, next) => {
  console.log('Submit route hit:', req.params, req.body);
  next();
}, submitSurveyResponse);

// 自动保存进度
router.post('/:surveyId/autosave', autoSaveValidation, validateRequest, autoSaveSurveyProgress);

// 需要认证的路由
// 获取当前用户的调查响应
router.get('/user/current', authenticate, queryValidation, validateRequest, getUserSurveyResponse);

// 删除调查响应（需要认证）
router.delete('/:surveyId', authenticate, getSurveyValidation, validateRequest, deleteSurveyResponse);

// 管理员路由
// 获取调查统计信息（需要管理员权限）
router.get('/admin/stats', authenticate, queryValidation, validateRequest, getSurveyStats);

export default router;