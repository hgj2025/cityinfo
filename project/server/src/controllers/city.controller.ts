import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient() as any;

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

  // 获取城市概览信息
  public getCityOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lang = req.query.lang as string || 'zh'; // 默认中文

      const cityOverview = await prisma.cityOverview.findUnique({
        where: { cityId: id },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              nameEn: true
            }
          }
        }
      });

      if (!cityOverview) {
        return next(new AppError(404, '城市概览信息不存在'));
      }

      // 本地化概览数据
      const localizedOverview = {
        id: cityOverview.id,
        cityId: cityOverview.cityId,
        city: {
          id: cityOverview.city.id,
          name: lang === 'en' ? cityOverview.city.nameEn : cityOverview.city.name
        },
        history: {
          title: lang === 'en' ? cityOverview.historyTitleEn : cityOverview.historyTitle,
          content: lang === 'en' ? cityOverview.historyContentEn : cityOverview.historyContent,
          image: cityOverview.historyImage
        },
        culture: {
          title: lang === 'en' ? cityOverview.cultureTitleEn : cityOverview.cultureTitle,
          content: lang === 'en' ? cityOverview.cultureContentEn : cityOverview.cultureContent,
          image: cityOverview.cultureImage
        },
        customs: {
          title: lang === 'en' ? cityOverview.customsTitleEn : cityOverview.customsTitle,
          content: lang === 'en' ? cityOverview.customsContentEn : cityOverview.customsContent,
          image: cityOverview.customsImage
        },
        heritageItems: lang === 'en' ? cityOverview.heritageItemsEn : cityOverview.heritageItems,
        festivals: lang === 'en' ? cityOverview.festivalsEn : cityOverview.festivals,
        historicalStories: lang === 'en' ? cityOverview.historicalStoriesEn : cityOverview.historicalStories,
        createdAt: cityOverview.createdAt,
        updatedAt: cityOverview.updatedAt
      };

      res.json({
        status: 'success',
        data: {
          overview: localizedOverview,
          language: lang
        }
      });
    } catch (error) {
      logger.error('获取城市概览失败:', error);
      next(new AppError(500, '获取城市概览失败'));
    }
  };

  // 根据initcity.json格式初始化城市概览信息
  public initializeCityOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city, content, pictureAdvises, pictures } = req.body;

      if (!city || !content) {
        return next(new AppError(400, '城市名称和内容数据不能为空'));
      }

      // 解析content JSON字符串
      let parsedContent;
      try {
        parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      } catch (error) {
        return next(new AppError(400, '内容数据格式错误，必须是有效的JSON'));
      }

      // 查找或创建城市
      let cityRecord = await prisma.city.findFirst({
        where: {
          OR: [
            { name: city },
            { nameEn: city }
          ]
        }
      });

      if (!cityRecord) {
        // 如果城市不存在，创建新城市
        cityRecord = await prisma.city.create({
          data: {
            name: city,
            nameEn: city, // 可以后续更新
            description: parsedContent.history?.cityinfo || `${city}是一座历史悠久的城市`,
            descriptionEn: `${city} is a city with rich history`,
            image: '', // 可以从pictures中提取
            location: city
          }
        });
      }

      // 转换数据格式
      const overviewData = {
        cityId: cityRecord.id,
        
        // 历史沿革
        historyTitle: '历史沿革',
        historyTitleEn: 'Historical Evolution',
        historyContent: [
          parsedContent.history?.cityinfo,
          parsedContent.history?.history,
          parsedContent.history?.importantEvent
        ].filter(Boolean).join('\n\n'),
        historyContentEn: 'Historical content in English', // 可以后续翻译
        historyImage: pictureAdvises?.[0] || '',
        
        // 文化特色
        cultureTitle: '文化特色',
        cultureTitleEn: 'Cultural Features',
        cultureContent: [
          parsedContent.culture?.culture,
          parsedContent.culture?.goodCulture,
          parsedContent.culture?.legacy,
          parsedContent.culture?.historyPlace
        ].filter(Boolean).join('\n\n'),
        cultureContentEn: 'Cultural content in English',
        cultureImage: pictureAdvises?.[1] || '',
        
        // 风俗习惯
        customsTitle: '风俗习惯',
        customsTitleEn: 'Customs and Traditions',
        customsContent: [
          parsedContent.tradition?.tradition,
          parsedContent.tradition?.bigday,
          parsedContent.tradition?.food,
          parsedContent.tradition?.daily
        ].filter(Boolean).join('\n\n'),
        customsContentEn: 'Customs content in English',
        customsImage: pictureAdvises?.[2] || '',
        
        // 艺术与非物质文化遗产
        heritageItems: Array.isArray(parsedContent.art) ? parsedContent.art.map((item: any) => ({
          itemName: item.itemName || '',
          desc: item.desc || '',
          history: item.history || '',
          pictureAdvise: item.pictureAdvise || ''
        })) : [],
        heritageItemsEn: [], // 可以后续翻译
        
        // 节庆活动
        festivals: Array.isArray(parsedContent.activity) ? parsedContent.activity.map((item: any) => ({
          activityName: item.activityName || '',
          activityTime: item.activityTime || '',
          activityContent: item.activityContent || '',
          pictureAdvise: item.pictureAdvise || ''
        })) : [],
        festivalsEn: [], // 可以后续翻译
        
        // 名人与历史故事
        historicalStories: Array.isArray(parsedContent.hero) ? parsedContent.hero.map((item: any) => ({
          name: item.name || '',
          desc: item.desc || '',
          story: item.story || '',
          pictureAdvise: item.pictureAdvise || ''
        })) : [],
        historicalStoriesEn: [], // 可以后续翻译
        
        // 图片数据存储
        pictureAdvises: Array.isArray(pictureAdvises) ? pictureAdvises : 
          (typeof pictureAdvises === 'string' ? 
            (() => {
              try {
                return JSON.parse(pictureAdvises);
              } catch {
                return [pictureAdvises];
              }
            })() : []),
        pictures: Array.isArray(pictures) ? pictures : 
          (typeof pictures === 'string' ? 
            (() => {
              try {
                return JSON.parse(pictures);
              } catch {
                return [pictures];
              }
            })() : [])
      };

      // 创建或更新城市概览
      const cityOverview = await prisma.cityOverview.upsert({
        where: { cityId: cityRecord.id },
        update: overviewData,
        create: overviewData,
        include: {
          city: {
            select: {
              id: true,
              name: true,
              nameEn: true
            }
          }
        }
      });

      res.json({
        status: 'success',
        data: {
          overview: cityOverview,
          message: `${city}城市概览信息初始化成功`
        }
      });
    } catch (error) {
      logger.error('初始化城市概览失败:', error);
      next(new AppError(500, '初始化城市概览失败'));
    }
  };

  // 批量初始化城市数据
  public initializeCitiesFromData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      if (!data || typeof data !== 'object') {
        return next(new AppError(400, '数据格式错误'));
      }

      const results = {
        cities: { created: 0, updated: 0 },
        cityOverviews: { created: 0, updated: 0 },
        users: { created: 0, updated: 0 },
        surveyResponses: { created: 0, updated: 0 }
      };

      // 初始化用户数据
      if (data.users && Array.isArray(data.users)) {
        for (const userData of data.users) {
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email: userData.email }
            });

            if (existingUser) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  name: userData.name,
                  avatar: userData.avatar,
                  nationality: userData.nationality,
                  languagePreference: userData.languagePreference,
                  ageGroup: userData.ageGroup,
                  phoneNumber: userData.phoneNumber
                }
              });
              results.users.updated++;
            } else {
              await prisma.user.create({
                data: userData
              });
              results.users.created++;
            }
          } catch (error) {
            logger.warn(`用户数据导入失败: ${userData.email}`, error);
          }
        }
      }

      // 初始化城市数据
      if (data.cities && Array.isArray(data.cities)) {
        for (const cityData of data.cities) {
          try {
            const existingCity = await prisma.city.findUnique({
              where: { id: cityData.id }
            });

            if (existingCity) {
              await prisma.city.update({
                where: { id: cityData.id },
                data: {
                  name: cityData.name,
                  nameEn: cityData.nameEn,
                  description: cityData.description,
                  descriptionEn: cityData.descriptionEn,
                  image: cityData.image,
                  location: cityData.location
                }
              });
              results.cities.updated++;
            } else {
              await prisma.city.create({
                data: cityData
              });
              results.cities.created++;
            }
          } catch (error) {
            logger.warn(`城市数据导入失败: ${cityData.name}`, error);
          }
        }
      }

      // 初始化城市概览数据
      if (data.cityOverviews && Array.isArray(data.cityOverviews)) {
        for (const overviewData of data.cityOverviews) {
          try {
            const existingOverview = await prisma.cityOverview.findUnique({
              where: { cityId: overviewData.cityId }
            });

            if (existingOverview) {
              await prisma.cityOverview.update({
                where: { cityId: overviewData.cityId },
                data: {
                  historyTitle: overviewData.historyTitle,
                  historyTitleEn: overviewData.historyTitleEn,
                  historyContent: overviewData.historyContent,
                  historyContentEn: overviewData.historyContentEn,
                  historyImage: overviewData.historyImage,
                  cultureTitle: overviewData.cultureTitle,
                  cultureTitleEn: overviewData.cultureTitleEn,
                  cultureContent: overviewData.cultureContent,
                  cultureContentEn: overviewData.cultureContentEn,
                  cultureImage: overviewData.cultureImage,
                  customsTitle: overviewData.customsTitle,
                  customsTitleEn: overviewData.customsTitleEn,
                  customsContent: overviewData.customsContent,
                  customsContentEn: overviewData.customsContentEn,
                  customsImage: overviewData.customsImage,
                  heritageItems: overviewData.heritageItems,
                  heritageItemsEn: overviewData.heritageItemsEn,
                  festivals: overviewData.festivals,
                  festivalsEn: overviewData.festivalsEn,
                  historicalStories: overviewData.historicalStories,
                  historicalStoriesEn: overviewData.historicalStoriesEn,
                  pictureAdvises: overviewData.pictureAdvises,
                  pictures: overviewData.pictures
                }
              });
              results.cityOverviews.updated++;
            } else {
              await prisma.cityOverview.create({
                data: overviewData
              });
              results.cityOverviews.created++;
            }
          } catch (error) {
            logger.warn(`城市概览数据导入失败: ${overviewData.cityId}`, error);
          }
        }
      }

      // 初始化调查回复数据
      if (data.surveyResponses && Array.isArray(data.surveyResponses)) {
        for (const surveyData of data.surveyResponses) {
          try {
            const existingSurvey = await prisma.surveyResponse.findUnique({
              where: { id: surveyData.id }
            });

            if (!existingSurvey) {
              await prisma.surveyResponse.create({
                data: surveyData
              });
              results.surveyResponses.created++;
            } else {
              results.surveyResponses.updated++;
            }
          } catch (error) {
            logger.warn(`调查回复数据导入失败: ${surveyData.id}`, error);
          }
        }
      }

      res.json({
        status: 'success',
        data: {
          results,
          message: '城市数据初始化完成'
        }
      });
    } catch (error) {
      logger.error('批量初始化城市数据失败:', error);
      next(new AppError(500, '批量初始化城市数据失败'));
    }
  };

  // 创建或更新城市概览信息
  public upsertCityOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        historyTitle,
        historyTitleEn,
        historyContent,
        historyContentEn,
        historyImage,
        cultureTitle,
        cultureTitleEn,
        cultureContent,
        cultureContentEn,
        cultureImage,
        customsTitle,
        customsTitleEn,
        customsContent,
        customsContentEn,
        customsImage,
        heritageItems,
        heritageItemsEn,
        festivals,
        festivalsEn,
        historicalStories,
        historicalStoriesEn
      } = req.body;

      // 验证城市是否存在
      const city = await prisma.city.findUnique({
        where: { id }
      });

      if (!city) {
        return next(new AppError(404, '城市不存在'));
      }

      // 创建或更新城市概览
      const cityOverview = await prisma.cityOverview.upsert({
        where: { cityId: id },
        update: {
          historyTitle,
          historyTitleEn,
          historyContent,
          historyContentEn,
          historyImage,
          cultureTitle,
          cultureTitleEn,
          cultureContent,
          cultureContentEn,
          cultureImage,
          customsTitle,
          customsTitleEn,
          customsContent,
          customsContentEn,
          customsImage,
          heritageItems,
          heritageItemsEn,
          festivals,
          festivalsEn,
          historicalStories,
          historicalStoriesEn
        },
        create: {
          cityId: id,
          historyTitle,
          historyTitleEn,
          historyContent,
          historyContentEn,
          historyImage,
          cultureTitle,
          cultureTitleEn,
          cultureContent,
          cultureContentEn,
          cultureImage,
          customsTitle,
          customsTitleEn,
          customsContent,
          customsContentEn,
          customsImage,
          heritageItems,
          heritageItemsEn,
          festivals,
          festivalsEn,
          historicalStories,
          historicalStoriesEn
        },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              nameEn: true
            }
          }
        }
      });

      res.json({
        status: 'success',
        data: {
          overview: cityOverview,
          message: '城市概览信息保存成功'
        }
      });
    } catch (error) {
      logger.error('保存城市概览失败:', error);
      next(new AppError(500, '保存城市概览失败'));
    }
  };
}