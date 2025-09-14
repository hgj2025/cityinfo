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
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = {
        ...(cityId && { cityId }),
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
          descriptionEn: true,
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

      // 根据语言返回相应内容
      const localizedAttractions = attractions.map((attraction: any) => ({
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
        openTime: attraction.openTime,
        cityId: attraction.cityId,
        city: {
          name: lang === 'en' ? attraction.city.nameEn : attraction.city.name,
          nameZh: attraction.city.name,
          nameEn: attraction.city.nameEn
        }
      }));

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          attractions: localizedAttractions,
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
      logger.error('获取景点列表失败:', error);
      next(new AppError(500, '获取景点列表失败'));
    }
  };

  // 获取景点详情
  public getAttractionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lang = req.query.lang as string || 'zh'; // 默认中文

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
        return next(new AppError(404, '景点不存在'));
      }

      // 本地化景点数据
      const localizedAttraction = {
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
        openTime: attraction.openTime,
        cityId: attraction.cityId,
        city: {
          id: attraction.city.id,
          name: lang === 'en' ? attraction.city.nameEn : attraction.city.name,
          nameZh: attraction.city.name,
          nameEn: attraction.city.nameEn
        },
        reviews: attraction.reviews
      };

      res.json({
        status: 'success',
        data: { 
          attraction: localizedAttraction,
          language: lang
        }
      });
    } catch (error) {
      logger.error('获取景点详情失败:', error);
      next(new AppError(500, '获取景点详情失败'));
    }
  };
}