import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class CollectionController {
  // 添加收藏
  public addCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemType, itemId } = req.body;
      const userId = req.user!.id;

      // 检查项目是否存在
      const item = await this.checkItemExists(itemType, itemId);
      if (!item) {
        return next(new AppError(404, '收藏项目不存在'));
      }

      // 检查是否已收藏
      const existingCollection = await prisma.collection.findFirst({
        where: {
          userId,
          itemType,
          itemId
        }
      });

      if (existingCollection) {
        return next(new AppError(400, '已经收藏过该项目'));
      }

      // 创建收藏
      const collection = await prisma.collection.create({
        data: {
          userId,
          itemType,
          itemId
        }
      });

      res.status(201).json({
        status: 'success',
        data: { collection }
      });
    } catch (error) {
      logger.error('添加收藏失败:', error);
      next(new AppError(500, '添加收藏失败'));
    }
  };

  // 获取用户收藏列表
  public getCollections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const itemType = req.query.itemType as string | undefined;

      const skip = (page - 1) * limit;

      // 构建查询条件
      const where = {
        userId,
        ...(itemType && { itemType })
      };

      // 查询总数
      const total = await prisma.collection.count({ where });

      // 查询收藏列表
      const collections = await prisma.collection.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });

      // 获取收藏项目的详细信息
      const collectionsWithItems = await Promise.all(
        collections.map(async (collection: any) => {
          const item = await this.getItemDetails(collection.itemType, collection.itemId);
          return {
            ...collection,
            item
          };
        })
      );

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: 'success',
        data: {
          collections: collectionsWithItems,
          pagination: {
            total,
            page,
            limit,
            pages: totalPages
          }
        }
      });
    } catch (error) {
      logger.error('获取收藏列表失败:', error);
      next(new AppError(500, '获取收藏列表失败'));
    }
  };

  // 删除收藏
  public removeCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const collection = await prisma.collection.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!collection) {
        return next(new AppError(404, '收藏不存在'));
      }

      await prisma.collection.delete({
        where: { id }
      });

      res.json({
        status: 'success',
        data: null
      });
    } catch (error) {
      logger.error('删除收藏失败:', error);
      next(new AppError(500, '删除收藏失败'));
    }
  };

  // 检查是否已收藏
  public checkCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemType, itemId } = req.body;
      const userId = req.user!.id;

      const collection = await prisma.collection.findFirst({
        where: {
          userId,
          itemType,
          itemId
        }
      });

      res.json({
        status: 'success',
        data: {
          isCollected: !!collection,
          collection
        }
      });
    } catch (error) {
      logger.error('检查收藏状态失败:', error);
      next(new AppError(500, '检查收藏状态失败'));
    }
  };

  // 辅助方法：检查项目是否存在
  private checkItemExists = async (itemType: string, itemId: string) => {
    switch (itemType) {
      case 'attraction':
        return await prisma.attraction.findUnique({ where: { id: itemId } });
      case 'restaurant':
        return await prisma.restaurant.findUnique({ where: { id: itemId } });
      case 'hotel':
        return await prisma.hotel.findUnique({ where: { id: itemId } });
      default:
        return null;
    }
  };

  // 辅助方法：获取项目详细信息
  private getItemDetails = async (itemType: string, itemId: string) => {
    const select = {
      id: true,
      name: true,
      description: true,
      image: true
    };

    switch (itemType) {
      case 'attraction':
        return await prisma.attraction.findUnique({
          where: { id: itemId },
          select
        });
      case 'restaurant':
        return await prisma.restaurant.findUnique({
          where: { id: itemId },
          select
        });
      case 'hotel':
        return await prisma.hotel.findUnique({
          where: { id: itemId },
          select
        });
      default:
        return null;
    }
  };
}