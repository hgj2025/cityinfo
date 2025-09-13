import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class AttractionController {
  // 获取景点列表
  public getAttractions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const cityId = req.query.cityId as string | undefined;
      const search = req.query.search as string | undefined;

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = {
        ...(cityId && { cityId }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { nameEn: { contains: search } },
            { description: { contains: search } }
          ]
        })
      };

      // 查询总数
      const total = await prisma.attraction.count({ where });

      // 查询景点列表
      const attractions = await prisma.attraction.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          nameEn: true,
          description: true,
          image: true,
          location: true,
          price: true,
          openTime: true,
          cityId: true,
          city: {
            select: {
              name: true,
              nameEn: true
            }
          }
        }
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          attractions,
          pagination: {
            total,
            page,
            limit,
            pages: totalPages
          }
        }
      });
    } catch (error) {
      logger.error('获取景点列表失败:', error);
      next(new AppError('获取景点列表失败', 500));
    }
  };

  // 获取景点详情
  public getAttractionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const attraction = await prisma.attraction.findUnique({
        where: { id },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              nameEn: true
            }
          },
          reviews: {
            select: {
              id: true,
              content: true,
              rating: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      if (!attraction) {
        return next(new AppError('景点不存在', 404));
      }

      res.json({
        status: 'success',
        data: { attraction }
      });
    } catch (error) {
      logger.error('获取景点详情失败:', error);
      next(new AppError('获取景点详情失败', 500));
    }
  };
}