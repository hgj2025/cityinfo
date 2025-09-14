import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class RestaurantController {
  // 获取餐厅列表
  public getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const cityId = req.query.cityId as string | undefined;
      const search = req.query.search as string | undefined;
      const cuisine = req.query.cuisine as string | undefined;
      const priceRange = req.query.priceRange as string | undefined;
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = {
        ...(cityId && { cityId }),
        ...(cuisine && { cuisine }),
        ...(priceRange && { priceRange }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { nameEn: { contains: search } },
            { description: { contains: search } },
            { descriptionEn: { contains: search } }
          ]
        })
      };

      // 查询总数
      const total = await prisma.restaurant.count({ where });

      // 查询餐厅列表
      const restaurants = await prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          nameEn: true,
          description: true,
          descriptionEn: true,
          image: true,
          location: true,
          cuisine: true,
          priceRange: true,
          openTime: true,
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

      // 根据语言返回相应内容
      const localizedRestaurants = restaurants.map((restaurant: any) => ({
        id: restaurant.id,
        name: lang === 'en' ? restaurant.nameEn : restaurant.name,
        nameZh: restaurant.name,
        nameEn: restaurant.nameEn,
        description: lang === 'en' ? restaurant.descriptionEn : restaurant.description,
        descriptionZh: restaurant.description,
        descriptionEn: restaurant.descriptionEn,
        image: restaurant.image,
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        priceRange: restaurant.priceRange,
        openTime: restaurant.openTime,
        contactNumber: restaurant.contactNumber,
        cityId: restaurant.cityId,
        city: {
          name: lang === 'en' ? restaurant.city.nameEn : restaurant.city.name,
          nameZh: restaurant.city.name,
          nameEn: restaurant.city.nameEn
        }
      }));

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          restaurants: localizedRestaurants,
          pagination: {
            total,
            page,
            limit,
            pages: totalPages
          },
          language: lang
        }
      });
    } catch (error) {
      logger.error('获取餐厅列表失败:', error);
      next(new AppError(500, '获取餐厅列表失败'));
    }
  };

  // 获取餐厅详情
  public getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              nameEn: true
            }
          },
          menu: true,
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

      if (!restaurant) {
        return next(new AppError(404, '餐厅不存在'));
      }

      // 本地化餐厅数据
      const localizedRestaurant = {
        id: restaurant.id,
        name: lang === 'en' ? restaurant.nameEn : restaurant.name,
        nameZh: restaurant.name,
        nameEn: restaurant.nameEn,
        description: lang === 'en' ? restaurant.descriptionEn : restaurant.description,
        descriptionZh: restaurant.description,
        descriptionEn: restaurant.descriptionEn,
        image: restaurant.image,
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        priceRange: restaurant.priceRange,
        openTime: restaurant.openTime,
        contactNumber: restaurant.contactNumber,
        cityId: restaurant.cityId,
        city: {
          id: restaurant.city.id,
          name: lang === 'en' ? restaurant.city.nameEn : restaurant.city.name,
          nameZh: restaurant.city.name,
          nameEn: restaurant.city.nameEn
        },
        menu: restaurant.menu,
        reviews: restaurant.reviews
      };

      res.json({
        status: 'success',
        data: { 
          restaurant: localizedRestaurant,
          language: lang
        }
      });
    } catch (error) {
      logger.error('获取餐厅详情失败:', error);
      next(new AppError(500, '获取餐厅详情失败'));
    }
  };
}