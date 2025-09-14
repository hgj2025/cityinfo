import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// 创建新的调查响应
export const createSurveyResponse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // 从认证中间件获取用户ID
    
    // 检查验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const validatedData = req.body;
    
    // 检查用户是否已有未完成的调查
    if (userId) {
      const existingSurvey = await prisma.surveyResponse.findFirst({
        where: {
          userId,
          isCompleted: false
        }
      });
      
      if (existingSurvey) {
        return res.status(409).json({
          error: 'User already has an incomplete survey',
          data: existingSurvey
        });
      }
    }
    
    // 创建新的调查响应
    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        id: uuidv4(),
        userId: userId,
        travelStyle: validatedData.travelStyle,
        budgetRange: validatedData.budgetRange,
        travelDuration: validatedData.travelDuration,
        groupSize: validatedData.groupSize,
        travelCompanions: validatedData.travelCompanions || [],
        preferredDestinations: validatedData.preferredDestinations || [],
        climatePreference: validatedData.climatePreference,
        seasonPreference: validatedData.seasonPreference || [],
        domesticVsInternational: validatedData.domesticVsInternational,
        activityTypes: validatedData.activityTypes || [],
        accommodationType: validatedData.accommodationType,
        transportationMode: validatedData.transportationMode || [],
        diningPreferences: validatedData.diningPreferences || [],
        accessibilityNeeds: validatedData.accessibilityNeeds || [],
        dietaryRestrictions: validatedData.dietaryRestrictions || [],
        languageBarriers: validatedData.languageBarriers,
        safetyPriority: validatedData.safetyPriority,
        interests: validatedData.interests || [],
        travelExperience: validatedData.travelExperience,
        previousDestinations: validatedData.previousDestinations || [],
        informationSources: validatedData.informationSources || [],
        bookingPreferences: validatedData.bookingPreferences || [],
        currentStep: validatedData.currentStep || 1,
        totalSteps: validatedData.totalSteps || 5,
        isCompleted: validatedData.isCompleted || false,
        lastSavedAt: new Date()
      }
    });
    
    res.status(201).json({
      success: true,
      data: surveyResponse
    });
  } catch (error) {
    console.error('Error creating survey response:', error);
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// 获取用户的调查响应
export const getUserSurveyResponse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { surveyId } = req.params;
    
    if (!userId && !surveyId) {
      return res.status(400).json({
        error: 'User ID or Survey ID is required'
      });
    }
    
    let surveyResponse;
    
    if (surveyId) {
      // 通过调查ID获取
      surveyResponse = await prisma.surveyResponse.findUnique({
        where: { id: surveyId }
      });
    } else {
      // 获取用户最新的调查响应
      surveyResponse = await prisma.surveyResponse.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      });
    }
    
    if (!surveyResponse) {
      return res.status(404).json({
        error: 'Survey response not found'
      });
    }
    
    res.json({
      success: true,
      data: surveyResponse
    });
  } catch (error) {
    console.error('Error fetching survey response:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// 更新调查响应（支持部分更新和断点续填）
export const updateSurveyResponse = async (req: Request, res: Response) => {
  try {
    const { surveyId } = req.params;
    const userId = req.user?.id;
    
    // 检查验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const validatedData = req.body;
    
    // 检查调查是否存在
    const existingSurvey = await prisma.surveyResponse.findUnique({
      where: { id: surveyId }
    });
    
    if (!existingSurvey) {
      return res.status(404).json({
        error: 'Survey response not found'
      });
    }
    
    // 检查权限（如果有用户ID，确保是同一用户）
     if (userId && existingSurvey.userId && existingSurvey.userId !== userId) {
       return res.status(403).json({
         error: 'Access denied'
       });
     }
    
    // 计算完成的字段
    const completedFields = Object.keys(validatedData).filter(key => 
      validatedData[key as keyof typeof validatedData] !== undefined && 
      validatedData[key as keyof typeof validatedData] !== null &&
      validatedData[key as keyof typeof validatedData] !== ''
    );
    
    // 合并已完成的字段
    const allCompletedFields = Array.from(new Set([
      ...(existingSurvey.completedFields || []),
      ...completedFields
    ]));
    
    // 更新调查响应
    const updatedSurvey = await prisma.surveyResponse.update({
      where: { id: surveyId },
      data: {
        ...validatedData,
        completedFields: allCompletedFields,
        lastSavedAt: new Date(),
        // 如果标记为完成，设置完成时间
        ...(validatedData.isCompleted && { completedAt: new Date() })
      }
    });
    
    res.json({
      success: true,
      data: updatedSurvey
    });
  } catch (error) {
    console.error('Error updating survey response:', error);
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// 提交完整的调查响应
export const submitSurveyResponse = async (req: Request, res: Response) => {
  
  try {
    const { surveyId } = req.params;
    const userId = req.user?.id;
    const validatedData = req.body;
    
    // 检查调查是否存在
    const existingSurvey = await prisma.surveyResponse.findUnique({
      where: { id: surveyId }
    });
    
    if (!existingSurvey) {
      return res.status(404).json({
        error: 'Survey response not found'
      });
    }
    
    // 检查权限
    if (userId && existingSurvey.userId && existingSurvey.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }
    
    // 检查是否已经完成
    if (existingSurvey.isCompleted) {
      return res.status(409).json({
        error: 'Survey already completed'
      });
    }
    
    // 更新为完成状态
    const completedSurvey = await prisma.surveyResponse.update({
      where: { id: surveyId },
      data: {
        ...validatedData,
        isCompleted: true,
        completedAt: new Date(),
        lastSavedAt: new Date()
      }
    });
    
    // TODO: 这里可以添加后续处理逻辑，如：
    // - 生成个性化推荐
    // - 发送确认邮件
    // - 创建线索记录
    
    res.json({
      success: true,
      message: 'Survey completed successfully',
      data: completedSurvey
    });
  } catch (error) {
    console.error('Error submitting survey response:', error);
    
    // 检查是否是Prisma验证错误
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // 如果是Prisma错误，返回更具体的错误信息
      if (error.message.includes('validation') || error.message.includes('constraint')) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          details: error.message
        });
      }
    }
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// 删除调查响应
export const deleteSurveyResponse = async (req: Request, res: Response) => {
  try {
    const { surveyId } = req.params;
    const userId = req.user?.id;
    
    // 检查调查是否存在
    const existingSurvey = await prisma.surveyResponse.findUnique({
      where: { id: surveyId }
    });
    
    if (!existingSurvey) {
      return res.status(404).json({
        error: 'Survey response not found'
      });
    }
    
    // 检查权限
    if (userId && existingSurvey.userId && existingSurvey.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }
    
    // 删除调查响应
    await prisma.surveyResponse.delete({
      where: { id: surveyId }
    });
    
    res.json({
      success: true,
      message: 'Survey response deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting survey response:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// 获取调查统计信息
export const getSurveyStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.surveyResponse.aggregate({
      _count: {
        id: true
      },
      where: {
        isCompleted: true
      }
    });
    
    const incompleteCount = await prisma.surveyResponse.count({
      where: {
        isCompleted: false
      }
    });
    
    res.json({
      success: true,
      data: {
        totalCompleted: stats._count.id,
        totalIncomplete: incompleteCount,
        totalResponses: stats._count.id + incompleteCount
      }
    });
  } catch (error) {
    console.error('Error fetching survey stats:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// 自动保存调查进度
export const autoSaveSurveyProgress = async (req: Request, res: Response) => {
  try {
    const { surveyId } = req.params;
    const userId = req.user?.id;
    
    // 检查验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const validatedData = req.body;
    const { currentStep, data } = validatedData;
    
    // 检查调查是否存在
    const existingSurvey = await prisma.surveyResponse.findUnique({
      where: { id: surveyId }
    });
    
    if (!existingSurvey) {
      return res.status(404).json({
        error: 'Survey response not found'
      });
    }
    
    // 更新调查数据
    const updateData: any = {
      lastSavedAt: new Date(),
      currentStep: currentStep
    };
    
    // 合并新数据到现有数据中
     if (data) {
       // 直接更新模型字段
       Object.keys(data).forEach(key => {
         if (data[key] !== undefined) {
           updateData[key] = data[key];
         }
       });
     }
    
    const updatedSurvey = await prisma.surveyResponse.update({
      where: { id: surveyId },
      data: updateData
    });
    
    res.json({
      success: true,
      message: 'Progress saved',
      data: {
        id: updatedSurvey.id,
        lastSavedAt: updatedSurvey.lastSavedAt,
        currentStep: updatedSurvey.currentStep
      }
    });
  } catch (error) {
    console.error('Error auto-saving survey progress:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};