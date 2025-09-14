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
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = search
        ? {
            OR: [
              { name: { contains: search } },
              { nameEn: { contains: search } },
              { description: { contains: search } },
              { descriptionEn: { contains: search } }
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
          descriptionEn: true,
          image: true,
          location: true
        }
      });

      // 根据语言返回相应内容
      const localizedCities = cities.map((city: any) => ({
        id: city.id,
        name: lang === 'en' ? city.nameEn : city.name,
        nameZh: city.name,
        nameEn: city.nameEn,
        description: lang === 'en' ? city.descriptionEn : city.description,
        descriptionZh: city.description,
        descriptionEn: city.descriptionEn,
        image: city.image,
        location: city.location
      }));

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          cities: localizedCities,
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
      logger.error('获取城市列表失败:', error);
      next(new AppError(500, '获取城市列表失败'));
    }
  };

  // 获取城市详情
  public getCityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const city = await prisma.city.findUnique({
        where: { id },
        include: {
          attractions: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              description: true,
              descriptionEn: true,
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
              nameEn: true,
              description: true,
              descriptionEn: true,
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
              nameEn: true,
              description: true,
              descriptionEn: true,
              image: true,
              location: true,
              priceRange: true,
              stars: true
            }
          }
        }
      });

      if (!city) {
        return next(new AppError(404, '城市不存在'));
      }

      // 本地化城市数据
      const localizedCity = {
        id: city.id,
        name: lang === 'en' ? city.nameEn : city.name,
        nameZh: city.name,
        nameEn: city.nameEn,
        description: lang === 'en' ? city.descriptionEn : city.description,
        descriptionZh: city.description,
        descriptionEn: city.descriptionEn,
        image: city.image,
        location: city.location,
        attractions: city.attractions.map((attraction: any) => ({
          id: attraction.id,
          name: lang === 'en' ? attraction.nameEn : attraction.name,
          nameZh: attraction.name,
          nameEn: attraction.nameEn,
          description: lang === 'en' ? attraction.descriptionEn : attraction.description,
          descriptionZh: attraction.description,
          descriptionEn: attraction.descriptionEn,
          image: attraction.image,
          location: attraction.location,
          price: attraction.price,
          openTime: attraction.openTime
        })),
        restaurants: city.restaurants.map((restaurant: any) => ({
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
          priceRange: restaurant.priceRange
        })),
        hotels: city.hotels.map((hotel: any) => ({
          id: hotel.id,
          name: lang === 'en' ? hotel.nameEn : hotel.name,
          nameZh: hotel.name,
          nameEn: hotel.nameEn,
          description: lang === 'en' ? hotel.descriptionEn : hotel.description,
          descriptionZh: hotel.description,
          descriptionEn: hotel.descriptionEn,
          image: hotel.image,
          location: hotel.location,
          priceRange: hotel.priceRange,
          stars: hotel.stars
        }))
      };

      res.json({
        status: 'success',
        data: { 
          city: localizedCity,
          language: lang
        }
      });
    } catch (error) {
      logger.error('获取城市详情失败:', error);
      next(new AppError(500, '获取城市详情失败'));
    }
  };
}