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
 * 获取采集任务数据并格式化为审核数据
 */
export const getCollectionTaskReviews = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // 获取指定任务的详情
    const task = await prisma.collectionTask.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: '任务不存在'
      });
    }

    // 解析任务的cozeResponse数据
    const cozeResponse = task.cozeResponse as any;
    if (!cozeResponse || !cozeResponse.data || !Array.isArray(cozeResponse.data)) {
      return res.json({
        status: 'success',
        data: {
          reviews: [],
          total: 0,
          page,
          limit
        }
      });
    }

    // 将采集数据转换为审核格式
    const allReviews: any[] = [];
    
    for (const cityData of cozeResponse.data) {
      // 处理历史文化数据
      if (cityData.history) {
        allReviews.push({
          id: `${taskId}-history-${Date.now()}`,
          taskId: taskId,
          dataType: 'city_overview',
          status: 'pending',
          data: {
            name: `${task.city} - 历史文化`,
            type: 'history',
            content: cityData.history,
            images: cityData.pictures || []
          },
          submittedAt: task.createdAt.toISOString(),
          reviewedAt: null,
          reviewerId: null,
          reviewerName: null,
          notes: null
        });
      }

      // 处理文化特色数据
      if (cityData.culture) {
        allReviews.push({
          id: `${taskId}-culture-${Date.now()}`,
          taskId: taskId,
          dataType: 'city_overview',
          status: 'pending',
          data: {
            name: `${task.city} - 文化特色`,
            type: 'culture',
            content: cityData.culture,
            images: cityData.pictures || []
          },
          submittedAt: task.createdAt.toISOString(),
          reviewedAt: null,
          reviewerId: null,
          reviewerName: null,
          notes: null
        });
      }

      // 处理艺术与非物质文化遗产
      if (cityData.art && Array.isArray(cityData.art)) {
        cityData.art.forEach((artItem: any, index: number) => {
          allReviews.push({
            id: `${taskId}-art-${index}-${Date.now()}`,
            taskId: taskId,
            dataType: 'art_heritage',
            status: 'pending',
            data: {
              name: artItem.itemName || `${task.city} - 艺术遗产 ${index + 1}`,
              description: artItem.desc,
              history: artItem.history,
              pictureAdvise: artItem.pictureAdvise,
              images: cityData.pictures || []
            },
            submittedAt: task.createdAt.toISOString(),
            reviewedAt: null,
            reviewerId: null,
            reviewerName: null,
            notes: null
          });
        });
      }

      // 处理历史名人
      if (cityData.hero && Array.isArray(cityData.hero)) {
        cityData.hero.forEach((hero: any, index: number) => {
          allReviews.push({
            id: `${taskId}-hero-${index}-${Date.now()}`,
            taskId: taskId,
            dataType: 'historical_figure',
            status: 'pending',
            data: {
              name: hero.name || `${task.city} - 历史名人 ${index + 1}`,
              description: hero.desc,
              story: hero.story,
              pictureAdvise: hero.pictureAdvise,
              images: cityData.pictures || []
            },
            submittedAt: task.createdAt.toISOString(),
            reviewedAt: null,
            reviewerId: null,
            reviewerName: null,
            notes: null
          });
        });
      }

      // 处理节庆活动
      if (cityData.activity && Array.isArray(cityData.activity)) {
        cityData.activity.forEach((activity: any, index: number) => {
          allReviews.push({
            id: `${taskId}-activity-${index}-${Date.now()}`,
            taskId: taskId,
            dataType: 'festival_activity',
            status: 'pending',
            data: {
              name: activity.activityName || `${task.city} - 节庆活动 ${index + 1}`,
              time: activity.activityTime,
              content: activity.activityContent,
              pictureAdvise: activity.pictureAdvise,
              images: cityData.pictures || []
            },
            submittedAt: task.createdAt.toISOString(),
            reviewedAt: null,
            reviewerId: null,
            reviewerName: null,
            notes: null
          });
        });
      }
    }

    // 分页处理
    const total = allReviews.length;
    const paginatedReviews = allReviews.slice(offset, offset + limit);

    res.json({
      status: 'success',
      data: {
        reviews: paginatedReviews,
        total,
        page,
        limit
      }
    });

  } catch (error: any) {
    logger.error('获取采集任务审核数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取采集任务审核数据失败',
      error: error.message
    });
  }
};

/**
 * 获取Coze采集的待审核数据列表
 */
export const getCozeReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // 查询Coze采集的待审核数据
    const reviews = await prisma.cozeReviewData.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        task: true
      }
    });

    const total = await prisma.cozeReviewData.count();

    // 格式化数据
    const formattedReviews = reviews.map((review: any) => ({
      id: review.id,
      taskId: review.taskId,
      dataType: review.dataType,
      status: review.status,
      data: {
        name: review.data.name || '未知',
        description: review.data.description || '',
        content: review.data.content || {},
        images: review.data.images || []
      },
      submittedAt: review.createdAt.toISOString(),
      reviewedAt: review.reviewedAt?.toISOString(),
      reviewerId: review.reviewerId,
      reviewerName: review.reviewerName,
      notes: review.notes
    }));

    res.json({
      status: 'success',
      data: {
        reviews: formattedReviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    logger.error('获取Coze审核数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取审核数据失败',
      error: error.message
    });
  }
};

/**
 * 审核Coze采集的数据
 */
export const reviewCozeData = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { action, notes, selectedImages } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        status: 'error',
        message: '无效的审核操作'
      });
    }

    // 查找待审核的数据
    const review = await prisma.cozeReviewData.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: '审核数据不存在'
      });
    }

    if (review.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: '该数据已经被审核过了'
      });
    }

    // 更新审核状态
    await prisma.cozeReviewData.update({
      where: { id: reviewId },
      data: {
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewedAt: new Date(),
        reviewerId: 'admin', // 这里应该从认证信息中获取
        reviewerName: '管理员',
        notes: notes || '',
        selectedImages: action === 'approve' ? selectedImages : undefined
      }
    });

    // 如果审核通过，将数据正式入库
    if (action === 'approve') {
      const finalData = {
        ...review.data,
        images: selectedImages || review.data.images
      };
      
      // 根据数据类型保存到对应的表
      await saveApprovedCozeData(finalData, review.dataType);
      logger.info(`Coze数据 ${reviewId} 审核通过，已入库`);
    }

    logger.info(`审核Coze数据 ${reviewId}，操作: ${action}`);

    res.json({
      status: 'success',
      message: `数据已${action === 'approve' ? '通过' : '拒绝'}审核`
    });
  } catch (error: any) {
    logger.error('审核Coze数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '审核数据失败',
      error: error.message
    });
  }
};

/**
 * 保存审核通过的Coze数据到对应的数据表
 */
const saveApprovedCozeData = async (data: any, dataType: string) => {
  try {
    switch (dataType) {
      case 'city_overview':
        // 保存城市概览数据
        await saveCityOverviewData(data);
        break;
      case 'attraction':
        // 保存景点数据
        await saveAttractionData(data);
        break;
      case 'restaurant':
        // 保存餐厅数据
        await saveRestaurantData(data);
        break;
      case 'hotel':
        // 保存酒店数据
        await saveHotelData(data);
        break;
      default:
        logger.warn(`未知的数据类型: ${dataType}`);
    }
  } catch (error) {
    logger.error('保存审核通过的数据失败:', error);
    throw error;
  }
};

/**
 * 保存城市概览数据
 */
const saveCityOverviewData = async (data: any) => {
  // 查找或创建城市
  let city = await prisma.city.findFirst({
    where: { name: data.name }
  });

  if (!city) {
    city = await prisma.city.create({
      data: {
        id: uuidv4(),
        name: data.name,
        nameEn: data.nameEn || data.name,
        description: data.description || '',
        descriptionEn: data.descriptionEn || data.description || '',
        image: data.images?.[0] || '',
        location: data.location || ''
      }
    });
  }

  // 解析content数据
  const content = data.content || {};
  const history = content.history || {};
  const culture = content.culture || {};
  const customs = content.customs || {};

  // 创建或更新城市概览
  await prisma.cityOverview.upsert({
    where: { cityId: city.id },
    update: {
      historyTitle: history.title || '历史沿革',
      historyTitleEn: history.titleEn || 'History',
      historyContent: history.content || '',
      historyContentEn: history.contentEn || '',
      historyImage: history.image || '',
      
      cultureTitle: culture.title || '文化特色',
      cultureTitleEn: culture.titleEn || 'Culture',
      cultureContent: culture.content || '',
      cultureContentEn: culture.contentEn || '',
      cultureImage: culture.image || '',
      
      customsTitle: customs.title || '风俗习惯',
      customsTitleEn: customs.titleEn || 'Customs',
      customsContent: customs.content || '',
      customsContentEn: customs.contentEn || '',
      customsImage: customs.image || '',
      
      heritageItems: content.heritageItems || [],
      heritageItemsEn: content.heritageItemsEn || [],
      festivals: content.festivals || [],
      festivalsEn: content.festivalsEn || [],
      historicalStories: content.historicalStories || [],
      historicalStoriesEn: content.historicalStoriesEn || [],
      pictures: data.images || []
    },
    create: {
      id: uuidv4(),
      cityId: city.id,
      historyTitle: history.title || '历史沿革',
      historyTitleEn: history.titleEn || 'History',
      historyContent: history.content || '',
      historyContentEn: history.contentEn || '',
      historyImage: history.image || '',
      
      cultureTitle: culture.title || '文化特色',
      cultureTitleEn: culture.titleEn || 'Culture',
      cultureContent: culture.content || '',
      cultureContentEn: culture.contentEn || '',
      cultureImage: culture.image || '',
      
      customsTitle: customs.title || '风俗习惯',
      customsTitleEn: customs.titleEn || 'Customs',
      customsContent: customs.content || '',
      customsContentEn: customs.contentEn || '',
      customsImage: customs.image || '',
      
      heritageItems: content.heritageItems || [],
      heritageItemsEn: content.heritageItemsEn || [],
      festivals: content.festivals || [],
      festivalsEn: content.festivalsEn || [],
      historicalStories: content.historicalStories || [],
      historicalStoriesEn: content.historicalStoriesEn || [],
      pictures: data.images || []
    }
  });
};

/**
   * 根据地址查找或创建城市ID
   */
  const findOrCreateCityId = async (address: string): Promise<string> => {
    // 尝试根据地址中的城市信息查找城市
    const location = address || '';
    let city = null;
    
    if (location.includes('厦门')) {
      city = await prisma.city.findFirst({ where: { name: '厦门' } });
    } else if (location.includes('福州')) {
      city = await prisma.city.findFirst({ where: { name: '福州' } });
    } else if (location.includes('泉州')) {
      city = await prisma.city.findFirst({ where: { name: '泉州' } });
    }
    
    // 如果找不到匹配的城市，使用第一个可用城市
    if (!city) {
      city = await prisma.city.findFirst();
      if (!city) {
        // 如果数据库中没有任何城市，创建一个默认城市
        city = await prisma.city.create({
          data: {
            id: uuidv4(),
            name: '默认城市',
            nameEn: 'Default City',
            description: '默认城市描述',
            descriptionEn: 'Default city description',
            image: '',
            location: ''
          }
        });
      }
    }
    return city.id;
  };

  /**
   * 保存景点数据
   */
  const saveAttractionData = async (data: any) => {
    // 如果没有提供cityId，尝试根据地址查找或创建默认城市
    let cityId = data.cityId;
    if (!cityId) {
      cityId = await findOrCreateCityId(data.address || '');
    }

  await prisma.attraction.create({
    data: {
      id: uuidv4(),
      name: data.name,
      nameEn: data.nameEn || data.name,
      description: data.description || '',
      descriptionEn: data.descriptionEn || data.description || '',
      image: data.images?.[0] || '',
      location: data.address || '',
      price: data.ticketPrice ? parseFloat(data.ticketPrice.replace(/[^\d.]/g, '')) || 0 : 0,
      openTime: data.openTime || '',
      cityId: cityId
    }
  });
};

/**
 * 保存餐厅数据
 */
const saveRestaurantData = async (data: any) => {
    // 如果没有提供cityId，尝试根据地址查找或创建默认城市
    let cityId = data.cityId;
    if (!cityId) {
      cityId = await findOrCreateCityId(data.address || '');
    }

  await prisma.restaurant.create({
    data: {
      id: uuidv4(),
      name: data.name,
      nameEn: data.nameEn || data.name,
      description: data.description || '',
      descriptionEn: data.descriptionEn || data.description || '',
      image: data.images?.[0] || '',
      location: data.address || '',
      priceRange: data.priceRange || '',
      cuisine: data.cuisine || '其他',
      cityId: cityId
    }
  });
};

/**
 * 保存酒店数据
 */
const saveHotelData = async (data: any) => {
    // 如果没有提供cityId，尝试根据地址查找或创建默认城市
    let cityId = data.cityId;
    if (!cityId) {
      cityId = await findOrCreateCityId(data.address || '');
    }

  await prisma.hotel.create({
    data: {
      id: uuidv4(),
      name: data.name,
      nameEn: data.nameEn || data.name,
      description: data.description || '',
      descriptionEn: data.descriptionEn || data.description || '',
      image: data.images?.[0] || '',
      location: data.address || '',
      priceRange: data.priceRange || '',
      stars: data.starRating || 0,
      cityId: cityId
    }
  });
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