import { Router } from 'express';
import authRouter from './auth.routes';
import { cityRouter } from './city.routes';
import { attractionRouter } from './attraction.routes';
import { restaurantRouter } from './restaurant.routes';
import { hotelRouter } from './hotel.routes';
import { collectionRouter } from './collection.routes';
import { searchRouter } from './search.routes';
import surveyRouter from './survey.routes';

export const setupRoutes = (app: Router) => {
  // API版本前缀
  const apiRouter = Router();
  app.use('/api/v1', apiRouter);

  // 认证路由
  apiRouter.use('/auth', authRouter);

  // 城市路由
  apiRouter.use('/cities', cityRouter);

  // 景点路由
  apiRouter.use('/attractions', attractionRouter);

  // 餐厅路由
  apiRouter.use('/restaurants', restaurantRouter);

  // 酒店路由
  apiRouter.use('/hotels', hotelRouter);

  // 收藏路由
  apiRouter.use('/collections', collectionRouter);

  // 搜索路由
  apiRouter.use('/search', searchRouter);

  // 调查表单路由
  apiRouter.use('/survey', surveyRouter);

  // 健康检查路由
  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'success', message: 'Server is running' });
  });
};