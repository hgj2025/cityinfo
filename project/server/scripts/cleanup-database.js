const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDatabase() {
  try {
    console.log('开始清理数据库测试数据...');

    // 1. 清理采集任务相关数据
    console.log('\n1. 清理采集任务数据...');
    
    // 删除数据审核记录
    const deletedDataReviews = await prisma.dataReview.deleteMany({});
    console.log(`删除了 ${deletedDataReviews.count} 条数据审核记录`);
    
    // 删除采集任务
    const deletedCollectionTasks = await prisma.collectionTask.deleteMany({});
    console.log(`删除了 ${deletedCollectionTasks.count} 条采集任务数据`);

    // 2. 清理Coze审核数据
    console.log('\n2. 清理Coze审核数据...');
    const deletedCozeReviews = await prisma.cozeReviewData.deleteMany({});
    console.log(`删除了 ${deletedCozeReviews.count} 条Coze审核数据`);

    // 3. 清理城市相关数据
    console.log('\n3. 清理城市相关数据...');
    
    // 删除景点数据
    const deletedAttractions = await prisma.attraction.deleteMany({});
    console.log(`删除了 ${deletedAttractions.count} 条景点数据`);
    
    // 删除餐厅数据
    const deletedRestaurants = await prisma.restaurant.deleteMany({});
    console.log(`删除了 ${deletedRestaurants.count} 条餐厅数据`);
    
    // 删除酒店数据
    const deletedHotels = await prisma.hotel.deleteMany({});
    console.log(`删除了 ${deletedHotels.count} 条酒店数据`);
    
    // 删除城市概览数据
    const deletedCityOverviews = await prisma.cityOverview.deleteMany({});
    console.log(`删除了 ${deletedCityOverviews.count} 条城市概览数据`);
    
    // 删除城市数据
    const deletedCities = await prisma.city.deleteMany({});
    console.log(`删除了 ${deletedCities.count} 条城市数据`);

    // 4. 清理用户和调研数据
    console.log('\n4. 清理用户和调研数据...');
    
    // 删除调研响应数据
    const deletedSurveyResponses = await prisma.surveyResponse.deleteMany({});
    console.log(`删除了 ${deletedSurveyResponses.count} 条调研响应数据`);
    
    // 删除旅行计划数据
    const deletedTravelPlans = await prisma.travelPlan.deleteMany({});
    console.log(`删除了 ${deletedTravelPlans.count} 条旅行计划数据`);
    
    // 删除用户数据
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`删除了 ${deletedUsers.count} 条用户数据`);

    console.log('\n✅ 数据库清理完成！');
    
    // 验证清理结果
    console.log('\n📊 清理后的数据统计：');
    const stats = {
      users: await prisma.user.count(),
      cities: await prisma.city.count(),
      cityOverviews: await prisma.cityOverview.count(),
      attractions: await prisma.attraction.count(),
      restaurants: await prisma.restaurant.count(),
      hotels: await prisma.hotel.count(),
      collectionTasks: await prisma.collectionTask.count(),
      dataReviews: await prisma.dataReview.count(),
      cozeReviewData: await prisma.cozeReviewData.count(),
      surveyResponses: await prisma.surveyResponse.count(),
      travelPlans: await prisma.travelPlan.count()
    };
    
    console.table(stats);

  } catch (error) {
    console.error('清理数据库时发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 添加确认提示
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('⚠️  警告：此操作将删除数据库中的所有数据！确定要继续吗？(y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    cleanupDatabase();
  } else {
    console.log('操作已取消');
  }
  rl.close();
});