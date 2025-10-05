#!/usr/bin/env node

/**
 * 数据验证脚本
 * 检查数据库中各表的数据统计
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyData() {
  try {
    console.log('🔍 验证数据库数据...');
    console.log('\n📊 数据库统计:');
    
    const stats = {
      users: await prisma.user.count(),
      cities: await prisma.city.count(),
      cityOverviews: await prisma.cityOverview.count(),
      attractions: await prisma.attraction.count(),
      restaurants: await prisma.restaurant.count(),
      hotels: await prisma.hotel.count(),
      collections: await prisma.collection.count(),
      travelPlans: await prisma.travelPlan.count(),
      consultationRequests: await prisma.consultationRequest.count(),
      callbackRequests: await prisma.callbackRequest.count(),
      emailSubscriptions: await prisma.emailSubscription.count(),
      surveyResponses: await prisma.surveyResponse.count(),
      leads: await prisma.lead.count()
    };
    
    console.log(`   - 用户: ${stats.users}`);
    console.log(`   - 城市: ${stats.cities}`);
    console.log(`   - 城市概览: ${stats.cityOverviews}`);
    console.log(`   - 景点: ${stats.attractions}`);
    console.log(`   - 餐厅: ${stats.restaurants}`);
    console.log(`   - 酒店: ${stats.hotels}`);
    console.log(`   - 收藏: ${stats.collections}`);
    console.log(`   - 旅行计划: ${stats.travelPlans}`);
    console.log(`   - 咨询请求: ${stats.consultationRequests}`);
    console.log(`   - 回电请求: ${stats.callbackRequests}`);
    console.log(`   - 邮件订阅: ${stats.emailSubscriptions}`);
    console.log(`   - 调查回复: ${stats.surveyResponses}`);
    console.log(`   - 线索: ${stats.leads}`);
    
    const totalRecords = Object.values(stats).reduce((sum, count) => sum + count, 0);
    console.log(`\n📈 总记录数: ${totalRecords}`);
    
    if (totalRecords > 0) {
      console.log('\n✅ 数据验证成功！数据库包含数据。');
    } else {
      console.log('\n⚠️  数据库为空，可能需要导入数据。');
    }
    
  } catch (error) {
    console.error('❌ 验证数据时发生错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 检查是否直接运行此脚本
if (require.main === module) {
  verifyData();
}

module.exports = { verifyData };