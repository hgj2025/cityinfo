import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class HotelController {
  // 获取酒店列表
  public getHotels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const cityId = req.query.cityId as string | undefined;
      const search = req.query.search as string | undefined;
      const priceRange = req.query.priceRange as string | undefined;
      const rating = req.query.rating ? Number(req.query.rating) : undefined;

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = {
        ...(cityId && { cityId }),
        ...(priceRange && { priceRange }),
        ...(rating && { rating: { gte: rating } }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } }
          ]
        })
      };

      // 查询总数
      const total = await prisma.hotel.count({ where });

      // 查询酒店列表
      const hotels = await prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          location: true,
          priceRange: true,
          rating: true,
          amenities: true,
          contactNumber: true,
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
          hotels,
          pagination: {
            total,
            page,
            limit,
            pages: totalPages
          }
        }
      });
    } catch (error) {
      logger.error('获取酒店列表失败:', error);
      next(new AppError('获取酒店列表失败', 500));
    }
  };

  // 获取酒店详情
  public getHotelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              nameEn: true
            }
          },
          rooms: {
            select: {
              id: true,
              type: true,
              description: true,
              price: true,
              capacity: true,
              amenities: true,
              images: true
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

      if (!hotel) {
        return next(new AppError('酒店不存在', 404));
      }

      res.json({
        status: 'success',
        data: { hotel }
      });
    } catch (error) {
      logger.error('获取酒店详情失败:', error);
      next(new AppError('获取酒店详情失败', 500));
    }
  };
}