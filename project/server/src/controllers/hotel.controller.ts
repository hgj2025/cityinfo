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
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = {
        ...(cityId && { cityId }),
        ...(priceRange && { priceRange }),
        ...(rating && { rating: { gte: rating } }),
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
      const total = await prisma.hotel.count({ where });

      // 查询酒店列表
      const hotels = await prisma.hotel.findMany({
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

      // 根据语言返回相应内容
      const localizedHotels = hotels.map((hotel: any) => ({
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
        rating: hotel.rating,
        amenities: hotel.amenities,
        contactNumber: hotel.contactNumber,
        cityId: hotel.cityId,
        city: {
          name: lang === 'en' ? hotel.city.nameEn : hotel.city.name,
          nameZh: hotel.city.name,
          nameEn: hotel.city.nameEn
        }
      }));

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          hotels: localizedHotels,
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
      logger.error('获取酒店列表失败:', error);
      next(new AppError(500, '获取酒店列表失败'));
    }
  };

  // 获取酒店详情
  public getHotelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lang = req.query.lang as string || 'zh'; // 默认中文

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
        return next(new AppError(404, '酒店不存在'));
      }

      // 本地化酒店数据
      const localizedHotel = {
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
        rating: hotel.rating,
        amenities: hotel.amenities,
        contactNumber: hotel.contactNumber,
        cityId: hotel.cityId,
        city: {
          id: hotel.city.id,
          name: lang === 'en' ? hotel.city.nameEn : hotel.city.name,
          nameZh: hotel.city.name,
          nameEn: hotel.city.nameEn
        },
        rooms: hotel.rooms,
        reviews: hotel.reviews
      };

      res.json({
        status: 'success',
        data: { 
          hotel: localizedHotel,
          language: lang
        }
      });
    } catch (error) {
      logger.error('获取酒店详情失败:', error);
      next(new AppError(500, '获取酒店详情失败'));
    }
  };
}