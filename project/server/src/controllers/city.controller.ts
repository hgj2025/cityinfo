import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class CityController {
  // 获取城市列表
  public getCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = search
        ? {
            OR: [
              { name: { contains: search } },
              { nameEn: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {};

      // 查询总数
      const total = await prisma.city.count({ where });

      // 查询城市列表
      const cities = await prisma.city.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          nameEn: true,
          description: true,
          image: true,
          location: true
        }
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          cities,
          pagination: {
            total,
            page,
            limit,
            pages: totalPages
          }
        }
      });
    } catch (error) {
      logger.error('获取城市列表失败:', error);
      next(new AppError('获取城市列表失败', 500));
    }
  };

  // 获取城市详情
  public getCityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const city = await prisma.city.findUnique({
        where: { id },
        include: {
          attractions: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              description: true,
              image: true,
              location: true,
              price: true,
              openTime: true
            }
          },
          restaurants: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              location: true,
              cuisine: true,
              priceRange: true
            }
          },
          hotels: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              location: true,
              priceRange: true,
              rating: true
            }
          }
        }
      });

      if (!city) {
        return next(new AppError('城市不存在', 404));
      }

      res.json({
        status: 'success',
        data: { city }
      });
    } catch (error) {
      logger.error('获取城市详情失败:', error);
      next(new AppError('获取城市详情失败', 500));
    }
  };
}