import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class SearchController {
  // 全局搜索
  public search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keyword = req.query.keyword as string;
      const type = req.query.type as 'city' | 'attraction' | 'restaurant' | 'hotel' | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // 构建搜索条件
      const searchCondition = {
        OR: [
          { name: { contains: keyword } },
          { nameEn: { contains: keyword } },
          { description: { contains: keyword } }
        ]
      };

      let total = 0;
      let results: any[] = [];

      // 根据类型执行不同的搜索
      if (!type || type === 'city') {
        const cities = await prisma.city.findMany({
          where: searchCondition,
          skip: type ? skip : 0,
          take: type ? limit : 3,
          select: {
            id: true,
            name: true,
            nameEn: true,
            description: true,
            image: true,
            type: () => 'city' as const
          }
        });
        if (type) {
          total = await prisma.city.count({ where: searchCondition });
          results = cities;
        } else {
          results = results.concat(cities);
        }
      }

      if (!type || type === 'attraction') {
        const attractions = await prisma.attraction.findMany({
          where: searchCondition,
          skip: type ? skip : 0,
          take: type ? limit : 3,
          select: {
            id: true,
            name: true,
            nameEn: true,
            description: true,
            image: true,
            price: true,
            type: () => 'attraction' as const
          }
        });
        if (type) {
          total = await prisma.attraction.count({ where: searchCondition });
          results = attractions;
        } else {
          results = results.concat(attractions);
        }
      }

      if (!type || type === 'restaurant') {
        const restaurants = await prisma.restaurant.findMany({
          where: searchCondition,
          skip: type ? skip : 0,
          take: type ? limit : 3,
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            cuisine: true,
            priceRange: true,
            type: () => 'restaurant' as const
          }
        });
        if (type) {
          total = await prisma.restaurant.count({ where: searchCondition });
          results = restaurants;
        } else {
          results = results.concat(restaurants);
        }
      }

      if (!type || type === 'hotel') {
        const hotels = await prisma.hotel.findMany({
          where: searchCondition,
          skip: type ? skip : 0,
          take: type ? limit : 3,
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            priceRange: true,
            rating: true,
            type: () => 'hotel' as const
          }
        });
        if (type) {
          total = await prisma.hotel.count({ where: searchCondition });
          results = hotels;
        } else {
          results = results.concat(hotels);
        }
      }

      // 如果没有指定类型，计算总数
      if (!type) {
        total = results.length;
      }

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          results,
          pagination: {
            total,
            page,
            limit,
            pages: totalPages
          }
        }
      });
    } catch (error) {
      logger.error('搜索失败:', error);
      next(new AppError(500, '搜索失败'));
    }
  };
}