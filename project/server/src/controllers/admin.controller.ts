import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { collectData, CollectionRequest } from '../services/coze.service';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient() as any;

// 移除内存存储，使用数据库模型

/**
 * 获取管理后台统计数据
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [citiesCount, attractionsCount, restaurantsCount, hotelsCount] = await Promise.all([
      prisma.city.count(),
      prisma.attraction.count(),
      prisma.restaurant.count(),
      prisma.hotel.count()
    ]);

    // 获取待审核数据数量（假设有审核状态字段）
    const pendingReviews = 0; // 这里需要根据实际的审核表结构来查询

    // 获取今日采集数量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCollections = await prisma.collectionTask.count({
      where: {
        createdAt: { gte: today },
        status: 'completed'
      }
    });

    res.json({
      status: 'success',
      data: {
        totalCities: citiesCount,
        totalAttractions: attractionsCount,
        totalFoods: restaurantsCount,
        totalHotels: hotelsCount,
        pendingReviews,
        todayCollections
      }
    });
  } catch (error) {
    logger.error('获取仪表板统计数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取统计数据失败'
    });
  }
};

/**
 * 启动数据采集任务
 */
export const startDataCollection = async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({
        status: 'error',
        message: '城市名称不能为空'
      });
    }

    // 创建采集任务记录
    const task = await prisma.collectionTask.create({
      data: {
        city: cityName,
        dataType: 'general',
        status: 'running',
        progress: 0
      }
    });

    // 异步执行数据采集
    performDataCollection(task.id, { cityName });

    logger.info(`启动数据采集任务: ${task.id}, 城市: ${cityName}`);

    res.json({
      status: 'success',
      message: '数据采集任务已启动',
      data: { taskId: task.id, task }
    });
  } catch (error: any) {
    logger.error('启动数据采集任务失败:', error);
    res.status(500).json({
      status: 'error',
      message: '启动数据采集任务失败',
      error: error.message
    });
  }
};

/**
 * 获取采集任务列表
 */
export const getCollectionTasks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const tasks = await prisma.collectionTask.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    });
    
    res.json({
      status: 'success',
      data: tasks
    });
  } catch (error: any) {
    logger.error('获取采集任务列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取采集任务列表失败',
      error: error.message
    });
  }
};

/**
 * 获取特定任务状态
 */
export const getTaskStatus = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    const task = await prisma.collectionTask.findUnique({
      where: { id: taskId }
    });
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: '任务不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: task
    });
  } catch (error: any) {
    logger.error('获取任务状态失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取任务状态失败',
      error: error.message
    });
  }
};

/**
 * 获取任务详细信息，包括Coze请求和响应详情
 */
export const getTaskDetails = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    const task = await prisma.collectionTask.findUnique({
      where: { id: taskId }
    });
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: '任务不存在'
      });
    }

    // 获取相关的审核数据
    const reviews = await prisma.dataReview.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      status: 'success',
      data: {
        ...task,
        reviews,
        // 确保这些字段存在于顶级对象中
        cozeRequest: task.cozeRequest,
        cozeResponse: task.cozeResponse,
        cozeApiCalls: task.cozeApiCalls,
        executionSteps: task.executionSteps,
        dataProcessing: task.dataProcessing,
        parseError: task.parseError  // 添加解析错误信息
      }
    });
  } catch (error: any) {
    logger.error('获取任务详情失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取任务详情失败',
      error: error.message
    });
  }
};

/**
 * 异步执行数据采集任务
 */
const performDataCollection = async (taskId: string, request: CollectionRequest) => {
  const executionSteps: any[] = [];
  const apiCalls: any[] = [];
  
  try {
    // 记录任务开始
    const startTime = new Date();
    executionSteps.push({
      step: 'task_started',
      timestamp: startTime,
      description: '任务开始执行',
      data: { request }
    });

    // 更新任务状态为运行中，记录请求参数
    await prisma.collectionTask.update({
      where: { id: taskId },
      data: { 
        status: 'running', 
        progress: 10,
        cozeRequest: request,
        executionSteps: executionSteps
      }
    });

    executionSteps.push({
      step: 'coze_api_call_start',
      timestamp: new Date(),
      description: '开始调用Coze API',
      data: { cityName: request.cityName }
    });

    // 调用Coze API进行数据采集
    const apiCallStart = new Date();
    const result = await collectData(request);
    const apiCallEnd = new Date();

    // 记录API调用详情
    const apiCallRecord = {
      startTime: apiCallStart,
      endTime: apiCallEnd,
      duration: apiCallEnd.getTime() - apiCallStart.getTime(),
      request: request,
      response: result,
      success: result.success
    };
    apiCalls.push(apiCallRecord);

    executionSteps.push({
      step: 'coze_api_call_completed',
      timestamp: apiCallEnd,
      description: `Coze API调用完成，耗时${apiCallRecord.duration}ms`,
      data: { 
        success: result.success, 
        dataCount: result.data?.length || 0,
        error: result.error 
      }
    });

    if (result.success && result.data) {
      // 更新进度和响应数据，包括解析错误信息
      await prisma.collectionTask.update({
        where: { id: taskId },
        data: { 
          progress: 50,
          cozeResponse: result,
          cozeApiCalls: apiCalls,
          executionSteps: executionSteps,
          parseError: result.parseError || null  // 保存解析错误信息
        }
      });

      executionSteps.push({
        step: 'data_processing_start',
        timestamp: new Date(),
        description: '开始处理采集到的数据',
        data: { 
          dataCount: result.data.length,
          hasParseError: !!result.parseError,
          parseError: result.parseError
        }
      });

      // 保存采集到的数据
      const saveDataStart = new Date();
      await saveCollectedData(result.data, request.cityName);
      const saveDataEnd = new Date();

      executionSteps.push({
        step: 'data_saved',
        timestamp: saveDataEnd,
        description: `数据保存完成，耗时${saveDataEnd.getTime() - saveDataStart.getTime()}ms`,
        data: { savedCount: result.data.length }
      });

      // 创建审核记录
      const reviewStart = new Date();
      for (const item of result.data) {
        await prisma.dataReview.create({
          data: {
            taskId,
            dataType: 'general',
            data: item,
            status: 'pending'
          }
        });
      }
      const reviewEnd = new Date();

      executionSteps.push({
        step: 'review_records_created',
        timestamp: reviewEnd,
        description: `审核记录创建完成，耗时${reviewEnd.getTime() - reviewStart.getTime()}ms`,
        data: { reviewCount: result.data.length }
      });

      // 任务完成
      const endTime = new Date();
      executionSteps.push({
        step: 'task_completed',
        timestamp: endTime,
        description: '任务执行完成',
        data: { 
          totalDuration: endTime.getTime() - startTime.getTime(),
          finalDataCount: result.data.length
        }
      });

      await prisma.collectionTask.update({
        where: { id: taskId },
        data: {
          status: 'completed',
          progress: 100,
          executionSteps: executionSteps,
          dataProcessing: {
            totalProcessed: result.data.length,
            processingTime: endTime.getTime() - startTime.getTime(),
            steps: executionSteps.length
          }
        }
      });

      logger.info(`数据采集任务 ${taskId} 完成，采集到 ${result.data.length} 条数据`);
    } else {
      // 任务失败
      executionSteps.push({
        step: 'task_failed',
        timestamp: new Date(),
        description: '任务执行失败',
        data: { error: result.error }
      });

      await prisma.collectionTask.update({
        where: { id: taskId },
        data: {
          status: 'failed',
          error: result.error || '数据采集失败',
          cozeResponse: result,
          cozeApiCalls: apiCalls,
          executionSteps: executionSteps
        }
      });

      logger.error(`数据采集任务 ${taskId} 失败: ${result.error}`);
    }
  } catch (error: any) {
    logger.error(`执行数据采集任务 ${taskId} 时发生错误:`, error);
    
    executionSteps.push({
      step: 'task_error',
      timestamp: new Date(),
      description: '任务执行出现异常',
      data: { error: error.message, stack: error.stack }
    });
    
    await prisma.collectionTask.update({
      where: { id: taskId },
      data: {
        status: 'failed',
        error: error.message,
        executionSteps: executionSteps,
        cozeApiCalls: apiCalls
      }
    });
  }
};

/**
 * 调用Coze API采集数据
 */


/**
 * 保存采集到的数据
 */
const saveCollectedData = async (data: any[], cityName: string) => {
  try {
    logger.info(`开始保存 ${cityName} 的数据，共 ${data.length} 条`);

    // 首先确保城市存在
    let city = await prisma.city.findFirst({ where: { name: cityName } });
    if (!city) {
      city = await prisma.city.create({
        data: {
          name: cityName,
          nameEn: cityName,
          description: `${cityName}城市信息`,
          descriptionEn: `${cityName} city information`,
          image: '',
          location: '未知'
        }
      });
    }

    // 保存为通用数据项
    for (const item of data) {
      // 根据数据内容判断类型并保存到相应表
      if (item.category && (item.category.includes('景点') || item.category.includes('景区') || item.ticketPrice)) {
        // 景点数据
        await prisma.attraction.create({
          data: {
            name: item.name || '未知景点',
            nameEn: item.nameEn || item.name || 'Unknown Attraction',
            description: item.description || '暂无描述',
            descriptionEn: item.descriptionEn || item.description || 'No description available',
            image: item.images?.[0] || item.imageUrl || '',
            location: item.address || item.location || '未知位置',
            price: item.ticketPrice ? parseFloat(item.ticketPrice.replace(/[^\d.]/g, '')) || null : null,
            openTime: item.openingHours || '',
            cityId: city.id
          }
        });
      } else if (item.cuisine || item.specialties || (item.category && item.category.includes('餐'))) {
        // 餐厅数据
        await prisma.restaurant.create({
          data: {
            name: item.name || '未知餐厅',
            nameEn: item.nameEn || item.name || 'Unknown Restaurant',
            description: item.description || '暂无描述',
            descriptionEn: item.descriptionEn || item.description || 'No description available',
            cuisine: item.cuisine || '其他',
            cityId: city.id,
            coordinates: item.coordinates ? JSON.stringify(item.coordinates) : null,
            openingHours: item.openingHours || '',
            priceRange: item.priceRange || '',
            rating: item.rating || 0,
            imageUrl: item.images?.[0] || '',
            specialties: item.specialties ? JSON.stringify(item.specialties) : null,
            isActive: true
          }
        });
      } else if (item.starRating || item.amenities || (item.category && item.category.includes('酒店'))) {
        // 酒店数据
        await prisma.hotel.create({
          data: {
            name: item.name || '未知酒店',
            nameEn: item.nameEn || item.name || 'Unknown Hotel',
            description: item.description || '暂无描述',
            descriptionEn: item.descriptionEn || item.description || 'No description available',
            category: item.category || '其他',
            address: item.address || '',
            cityId: city.id,
            coordinates: item.coordinates ? JSON.stringify(item.coordinates) : null,
            starRating: item.starRating || 0,
            priceRange: item.priceRange || '',
            amenities: item.amenities ? JSON.stringify(item.amenities) : null,
            imageUrl: item.images?.[0] || '',
            roomTypes: item.roomTypes ? JSON.stringify(item.roomTypes) : null,
            isActive: true
          }
        });
      } else {
        // 默认保存为景点
        await prisma.attraction.create({
          data: {
            name: item.name || '未知项目',
            nameEn: item.nameEn || item.name || 'Unknown Item',
            description: item.description || '暂无描述',
            descriptionEn: item.descriptionEn || item.description || 'No description available',
            image: item.images?.[0] || item.imageUrl || '',
            location: item.address || item.location || '未知位置',
            price: null,
            openTime: item.openingHours || '',
            cityId: city.id
          }
        });
      }
    }

    logger.info(`成功保存 ${cityName} 的数据`);
  } catch (error: any) {
    logger.error('保存采集数据失败:', error);
    throw error;
  }
};

/**
 * 获取待审核数据列表
 */
export const getPendingReviews = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, dataType, status = 'pending' } = req.query;
    
    const whereClause: any = { status };
    if (dataType) {
      whereClause.dataType = dataType;
    }

    const reviews = await prisma.dataReview.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    });

    res.json({
      status: 'success',
      data: reviews
    });
  } catch (error: any) {
    logger.error('获取待审核数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取待审核数据失败',
      error: error.message
    });
  }
};

/**
 * 审核数据
 */
export const reviewData = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { action, editedData, notes, reviewerId = 'admin' } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        status: 'error',
        message: '无效的审核操作'
      });
    }

    // 查找审核记录
    const review = await prisma.dataReview.findUnique({
      where: { id: reviewId }
    });
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: '审核记录不存在'
      });
    }

    // 更新审核状态
    await prisma.dataReview.update({
       where: { id: reviewId },
       data: {
         status: action === 'approve' ? 'approved' : 'rejected',
         reviewerId,
         reviewNotes: notes,
         reviewedAt: new Date()
       }
     });

    // 如果审核通过，将数据正式入库
    if (action === 'approve') {
      const finalData = editedData || review.data;
      // 将审核通过的数据保存到对应的数据表
       await saveCollectedData([finalData], 'Unknown City');
      logger.info(`数据 ${reviewId} 审核通过，已入库`);
    }

    logger.info(`审核数据 ${reviewId}，操作: ${action}`);

    res.json({
      status: 'success',
      message: `数据已${action === 'approve' ? '通过' : '拒绝'}审核`
    });
  } catch (error: any) {
    logger.error('审核数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '审核数据失败',
      error: error.message
    });
  }
};