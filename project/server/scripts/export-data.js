#!/usr/bin/env node

/**
 * 数据导出脚本
 * 将本地数据库的数据导出为JSON文件，用于迁移到Render数据库
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('🚀 开始导出数据库数据...');
    
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {}
    };

    // 导出所有表的数据
    console.log('📊 导出用户数据...');
    exportData.data.users = await prisma.user.findMany();
    console.log(`✅ 导出 ${exportData.data.users.length} 个用户`);

    console.log('🏙️ 导出城市数据...');
    exportData.data.cities = await prisma.city.findMany();
    console.log(`✅ 导出 ${exportData.data.cities.length} 个城市`);

    console.log('📖 导出城市概览数据...');
    exportData.data.cityOverviews = await prisma.cityOverview.findMany();
    console.log(`✅ 导出 ${exportData.data.cityOverviews.length} 个城市概览`);

    console.log('🎯 导出景点数据...');
    exportData.data.attractions = await prisma.attraction.findMany();
    console.log(`✅ 导出 ${exportData.data.attractions.length} 个景点`);

    console.log('🍽️ 导出餐厅数据...');
    exportData.data.restaurants = await prisma.restaurant.findMany();
    console.log(`✅ 导出 ${exportData.data.restaurants.length} 个餐厅`);

    console.log('🏨 导出酒店数据...');
    exportData.data.hotels = await prisma.hotel.findMany();
    console.log(`✅ 导出 ${exportData.data.hotels.length} 个酒店`);

    console.log('⭐ 导出收藏数据...');
    exportData.data.collections = await prisma.collection.findMany();
    console.log(`✅ 导出 ${exportData.data.collections.length} 个收藏`);

    console.log('✈️ 导出旅行计划数据...');
    exportData.data.travelPlans = await prisma.travelPlan.findMany();
    console.log(`✅ 导出 ${exportData.data.travelPlans.length} 个旅行计划`);

    console.log('💬 导出咨询请求数据...');
    exportData.data.consultationRequests = await prisma.consultationRequest.findMany();
    console.log(`✅ 导出 ${exportData.data.consultationRequests.length} 个咨询请求`);

    console.log('📞 导出回电请求数据...');
    exportData.data.callbackRequests = await prisma.callbackRequest.findMany();
    console.log(`✅ 导出 ${exportData.data.callbackRequests.length} 个回电请求`);

    console.log('📧 导出邮件订阅数据...');
    exportData.data.emailSubscriptions = await prisma.emailSubscription.findMany();
    console.log(`✅ 导出 ${exportData.data.emailSubscriptions.length} 个邮件订阅`);

    console.log('📋 导出调查回复数据...');
    exportData.data.surveyResponses = await prisma.surveyResponse.findMany();
    console.log(`✅ 导出 ${exportData.data.surveyResponses.length} 个调查回复`);

    console.log('🎯 导出线索数据...');
    exportData.data.leads = await prisma.lead.findMany();
    console.log(`✅ 导出 ${exportData.data.leads.length} 个线索`);

    // 生成文件名（包含时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `cityinfo-data-export-${timestamp}.json`;
    const filepath = path.join(__dirname, filename);

    // 写入文件
    fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2), 'utf8');
    
    console.log('\n🎉 数据导出完成！');
    console.log(`📁 文件位置: ${filepath}`);
    console.log(`📊 总计导出数据:`);
    console.log(`   - 用户: ${exportData.data.users.length}`);
    console.log(`   - 城市: ${exportData.data.cities.length}`);
    console.log(`   - 城市概览: ${exportData.data.cityOverviews.length}`);
    console.log(`   - 景点: ${exportData.data.attractions.length}`);
    console.log(`   - 餐厅: ${exportData.data.restaurants.length}`);
    console.log(`   - 酒店: ${exportData.data.hotels.length}`);
    console.log(`   - 收藏: ${exportData.data.collections.length}`);
    console.log(`   - 旅行计划: ${exportData.data.travelPlans.length}`);
    console.log(`   - 咨询请求: ${exportData.data.consultationRequests.length}`);
    console.log(`   - 回电请求: ${exportData.data.callbackRequests.length}`);
    console.log(`   - 邮件订阅: ${exportData.data.emailSubscriptions.length}`);
    console.log(`   - 调查回复: ${exportData.data.surveyResponses.length}`);
    console.log(`   - 线索: ${exportData.data.leads.length}`);
    
    console.log('\n📝 使用说明:');
    console.log('1. 将此文件上传到Render服务器');
    console.log('2. 运行 import-data.js 脚本导入数据');
    console.log('3. 验证数据完整性');
    
  } catch (error) {
    console.error('❌ 导出数据时发生错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 检查是否直接运行此脚本
if (require.main === module) {
  exportData();
}

module.exports = { exportData };