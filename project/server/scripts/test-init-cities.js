const fs = require('fs');
const path = require('path');

// 测试城市数据初始化接口
async function testInitializeCities() {
  try {
    // 读取导出的数据文件
    const dataFilePath = path.join(__dirname, 'cityinfo-data-export-2025-10-05T07-45-42.json');
    
    if (!fs.existsSync(dataFilePath)) {
      console.error('数据文件不存在:', dataFilePath);
      return;
    }

    const exportedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    // 准备请求数据
    const requestData = {
      data: exportedData.data
    };

    console.log('准备发送的数据统计:');
    console.log('- 用户数量:', exportedData.data.users?.length || 0);
    console.log('- 城市数量:', exportedData.data.cities?.length || 0);
    console.log('- 城市概览数量:', exportedData.data.cityOverviews?.length || 0);
    console.log('- 调查回复数量:', exportedData.data.surveyResponses?.length || 0);
    console.log('');

    // 发送请求到初始化接口
    const response = await fetch('http://localhost:3001/api/cities/initialize-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('请求失败:', response.status, errorText);
      return;
    }

    const result = await response.json();
    
    console.log('初始化结果:');
    console.log('- 状态:', result.status);
    console.log('- 消息:', result.data.message);
    console.log('- 详细结果:');
    console.log('  用户: 创建', result.data.results.users.created, '个, 更新', result.data.results.users.updated, '个');
    console.log('  城市: 创建', result.data.results.cities.created, '个, 更新', result.data.results.cities.updated, '个');
    console.log('  城市概览: 创建', result.data.results.cityOverviews.created, '个, 更新', result.data.results.cityOverviews.updated, '个');
    console.log('  调查回复: 创建', result.data.results.surveyResponses.created, '个, 更新', result.data.results.surveyResponses.updated, '个');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 验证初始化结果
async function verifyInitialization() {
  try {
    console.log('\n验证初始化结果...');
    
    // 检查城市列表
    const citiesResponse = await fetch('http://localhost:3001/api/cities');
    if (citiesResponse.ok) {
      const citiesData = await citiesResponse.json();
      console.log('城市列表验证: 共', citiesData.data.cities.length, '个城市');
      citiesData.data.cities.forEach(city => {
        console.log('  -', city.name, '(', city.nameEn, ')');
      });
    }
    
    // 检查南京城市概览
    const nanjingId = '550e8400-e29b-41d4-a716-446655440004';
    const overviewResponse = await fetch(`http://localhost:3001/api/cities/${nanjingId}/overview`);
    if (overviewResponse.ok) {
      const overviewData = await overviewResponse.json();
      console.log('\n南京城市概览验证:');
      console.log('  - 历史标题:', overviewData.data.overview.history.title);
      console.log('  - 文化标题:', overviewData.data.overview.culture.title);
      console.log('  - 风俗标题:', overviewData.data.overview.customs.title);
      console.log('  - 非遗项目数量:', overviewData.data.overview.heritageItems.length);
      console.log('  - 节庆活动数量:', overviewData.data.overview.festivals.length);
      console.log('  - 历史故事数量:', overviewData.data.overview.historicalStories.length);
    }
    
  } catch (error) {
    console.error('验证失败:', error.message);
  }
}

// 主函数
async function main() {
  console.log('=== 城市数据初始化测试 ===\n');
  
  await testInitializeCities();
  await verifyInitialization();
  
  console.log('\n=== 测试完成 ===');
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testInitializeCities, verifyInitialization };