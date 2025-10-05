#!/usr/bin/env node

/**
 * 数据导入脚本
 * 将导出的JSON数据导入到Render数据库
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// 获取命令行参数
const args = process.argv.slice(2);
const dataFile = args[0];

if (!dataFile) {
  console.error('❌ 请提供数据文件路径');
  console.log('使用方法: node import-data.js <数据文件路径>');
  console.log('示例: node import-data.js cityinfo-data-export-2024-01-01T12-00-00.json');
  process.exit(1);
}

async function importData(filePath) {
  try {
    console.log('🚀 开始导入数据库数据...');
    console.log(`📁 数据文件: ${filePath}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`数据文件不存在: ${filePath}`);
    }

    // 读取数据文件
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const importData = JSON.parse(fileContent);
    
    console.log(`📊 数据文件信息:`);
    console.log(`   - 导出时间: ${importData.timestamp}`);
    console.log(`   - 版本: ${importData.version}`);
    
    const data = importData.data;
    
    // 清空现有数据（可选，谨慎使用）
    const shouldClearData = process.env.CLEAR_EXISTING_DATA === 'true';
    if (shouldClearData) {
      console.log('⚠️  清空现有数据...');
      await clearExistingData();
    }
    
    // 按依赖关系顺序导入数据
    console.log('\n📥 开始导入数据...');
    
    // 1. 导入用户数据
    if (data.users && data.users.length > 0) {
      console.log('👥 导入用户数据...');
      for (const user of data.users) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user
        });
      }
      console.log(`✅ 导入 ${data.users.length} 个用户`);
    }

    // 2. 导入城市数据
    if (data.cities && data.cities.length > 0) {
      console.log('🏙️ 导入城市数据...');
      for (const city of data.cities) {
        await prisma.city.upsert({
          where: { id: city.id },
          update: city,
          create: city
        });
      }
      console.log(`✅ 导入 ${data.cities.length} 个城市`);
    }

    // 3. 导入城市概览数据
    if (data.cityOverviews && data.cityOverviews.length > 0) {
      console.log('📖 导入城市概览数据...');
      for (const overview of data.cityOverviews) {
        await prisma.cityOverview.upsert({
          where: { id: overview.id },
          update: overview,
          create: overview
        });
      }
      console.log(`✅ 导入 ${data.cityOverviews.length} 个城市概览`);
    }

    // 4. 导入景点数据
    if (data.attractions && data.attractions.length > 0) {
      console.log('🎯 导入景点数据...');
      for (const attraction of data.attractions) {
        await prisma.attraction.upsert({
          where: { id: attraction.id },
          update: attraction,
          create: attraction
        });
      }
      console.log(`✅ 导入 ${data.attractions.length} 个景点`);
    }

    // 5. 导入餐厅数据
    if (data.restaurants && data.restaurants.length > 0) {
      console.log('🍽️ 导入餐厅数据...');
      for (const restaurant of data.restaurants) {
        await prisma.restaurant.upsert({
          where: { id: restaurant.id },
          update: restaurant,
          create: restaurant
        });
      }
      console.log(`✅ 导入 ${data.restaurants.length} 个餐厅`);
    }

    // 6. 导入酒店数据
    if (data.hotels && data.hotels.length > 0) {
      console.log('🏨 导入酒店数据...');
      for (const hotel of data.hotels) {
        await prisma.hotel.upsert({
          where: { id: hotel.id },
          update: hotel,
          create: hotel
        });
      }
      console.log(`✅ 导入 ${data.hotels.length} 个酒店`);
    }

    // 7. 导入收藏数据
    if (data.collections && data.collections.length > 0) {
      console.log('⭐ 导入收藏数据...');
      for (const collection of data.collections) {
        await prisma.collection.upsert({
          where: { id: collection.id },
          update: collection,
          create: collection
        });
      }
      console.log(`✅ 导入 ${data.collections.length} 个收藏`);
    }

    // 8. 导入旅行计划数据
    if (data.travelPlans && data.travelPlans.length > 0) {
      console.log('✈️ 导入旅行计划数据...');
      for (const plan of data.travelPlans) {
        await prisma.travelPlan.upsert({
          where: { id: plan.id },
          update: plan,
          create: plan
        });
      }
      console.log(`✅ 导入 ${data.travelPlans.length} 个旅行计划`);
    }

    // 9. 导入其他数据
    const otherTables = [
      { name: 'consultationRequests', model: 'consultationRequest', label: '咨询请求' },
      { name: 'callbackRequests', model: 'callbackRequest', label: '回电请求' },
      { name: 'emailSubscriptions', model: 'emailSubscription', label: '邮件订阅' },
      { name: 'surveyResponses', model: 'surveyResponse', label: '调查回复' },
      { name: 'leads', model: 'lead', label: '线索' }
    ];

    for (const table of otherTables) {
      if (data[table.name] && data[table.name].length > 0) {
        console.log(`📋 导入${table.label}数据...`);
        for (const item of data[table.name]) {
          await prisma[table.model].upsert({
            where: { id: item.id },
            update: item,
            create: item
          });
        }
        console.log(`✅ 导入 ${data[table.name].length} 个${table.label}`);
      }
    }
    
    console.log('\n🎉 数据导入完成！');
    console.log('\n📊 导入统计:');
    console.log(`   - 用户: ${data.users?.length || 0}`);
    console.log(`   - 城市: ${data.cities?.length || 0}`);
    console.log(`   - 城市概览: ${data.cityOverviews?.length || 0}`);
    console.log(`   - 景点: ${data.attractions?.length || 0}`);
    console.log(`   - 餐厅: ${data.restaurants?.length || 0}`);
    console.log(`   - 酒店: ${data.hotels?.length || 0}`);
    console.log(`   - 收藏: ${data.collections?.length || 0}`);
    console.log(`   - 旅行计划: ${data.travelPlans?.length || 0}`);
    console.log(`   - 咨询请求: ${data.consultationRequests?.length || 0}`);
    console.log(`   - 回电请求: ${data.callbackRequests?.length || 0}`);
    console.log(`   - 邮件订阅: ${data.emailSubscriptions?.length || 0}`);
    console.log(`   - 调查回复: ${data.surveyResponses?.length || 0}`);
    console.log(`   - 线索: ${data.leads?.length || 0}`);
    
  } catch (error) {
    console.error('❌ 导入数据时发生错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function clearExistingData() {
  console.log('🗑️  清空现有数据...');
  
  // 按依赖关系逆序删除
  await prisma.collection.deleteMany();
  await prisma.travelPlan.deleteMany();
  await prisma.consultationRequest.deleteMany();
  await prisma.callbackRequest.deleteMany();
  await prisma.emailSubscription.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.cityOverview.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ 现有数据已清空');
}

// 检查是否直接运行此脚本
if (require.main === module) {
  importData(dataFile);
}

module.exports = { importData };