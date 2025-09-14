const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// 测试数据
const testSurveyData = {
  travelStyle: 'cultural',
  budgetRange: 'mid_range',
  travelDuration: '7-14天',
  groupSize: 2,
  travelCompanions: ['朋友'],
  preferredDestinations: ['东南亚', '欧洲'],
  climatePreference: '温带',
  seasonPreference: ['春季', '秋季'],
  domesticVsInternational: '国际',
  activityTypes: ['历史文化', '美食体验', '自然风光'],
  accommodationType: 'hotel',
  transportationMode: ['飞机'],
  diningPreferences: ['当地特色'],
  interests: ['摄影', '徒步'],
  currentStep: 1,
  totalSteps: 5,
  isCompleted: false
};

async function testSurveyAPI() {
  console.log('🚀 开始测试调查表单API...');
  
  try {
    // 1. 测试创建调查响应
    console.log('\n1. 测试创建调查响应...');
    const createResponse = await axios.post(`${BASE_URL}/survey`, testSurveyData);
    console.log('✅ 创建成功:', createResponse.data);
    
    const surveyId = createResponse.data.data.id;
    console.log('📝 调查ID:', surveyId);
    
    // 2. 测试获取调查响应
    console.log('\n2. 测试获取调查响应...');
    const getResponse = await axios.get(`${BASE_URL}/survey/${surveyId}`);
    console.log('✅ 获取成功:', getResponse.data);
    
    // 3. 测试更新调查响应
    console.log('\n3. 测试更新调查响应...');
    const updateData = {
      travelStyle: 'cultural',
      budgetRange: 'mid_range',
      travelDuration: '7-14天',
      groupSize: 2,
      travelCompanions: ['伴侣'],
      preferredDestinations: ['东南亚', '欧洲'],
      climatePreference: '温带',
      seasonPreference: ['春季', '秋季'],
      domesticVsInternational: '国际',
      activityTypes: ['文化体验', '美食探索'],
      accommodationType: '酒店',
      transportationMode: ['飞机', '火车'],
      currentStep: 2
    };
    const updateResponse = await axios.put(`${BASE_URL}/survey/${surveyId}`, updateData);
    console.log('✅ 更新成功:', updateResponse.data);
    
    // 4. 测试自动保存进度
    console.log('\n4. 测试自动保存进度...');
    const autoSaveData = {
      currentStep: 3,
      data: {
        interests: ['摄影', '徒步', '美食'],
        accommodationType: 'hotel',
        diningPreferences: ['当地特色', '素食选项'],
        safetyPriority: 4
      }
    };
    const autoSaveResponse = await axios.post(`${BASE_URL}/survey/${surveyId}/autosave`, autoSaveData);
    console.log('✅ 自动保存成功:', autoSaveResponse.data);
    
    // 5. 测试提交调查响应
    console.log('\n5. 测试提交调查响应...');
    const submitData = {
      travelStyle: 'cultural',
      budgetRange: 'mid_range',
      travelDuration: '7-14天',
      groupSize: 2,
      travelCompanions: ['朋友'],
      preferredDestinations: ['东南亚', '欧洲'],
      climatePreference: '温带',
      seasonPreference: ['春季', '秋季'],
      domesticVsInternational: '国际',
      activityTypes: ['历史文化', '美食体验', '自然风光'],
      accommodationType: 'hotel',
      transportationMode: ['飞机'],
      diningPreferences: ['当地特色'],
      interests: ['摄影', '徒步'],
      travelExperience: '经验丰富',
      previousDestinations: ['日本', '泰国', '法国'],
      informationSources: ['网络搜索', '朋友推荐'],
      bookingPreferences: ['在线预订', '旅行社'],
      isCompleted: true,
      currentStep: 5,
      totalSteps: 5
    };
    const submitResponse = await axios.post(`${BASE_URL}/survey/${surveyId}/submit`, submitData);
    console.log('✅ 提交成功:', submitResponse.data);
    
    // 6. 测试获取统计信息（可能需要认证，这里只是测试接口是否存在）
    console.log('\n6. 测试获取统计信息...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/survey/admin/stats`);
      console.log('✅ 统计信息获取成功:', statsResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('⚠️  统计信息需要认证（预期行为）');
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 所有API测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    console.log('状态码:', error.response?.status);
    console.log('响应数据:', error.response?.data);
    if (error.response?.data?.details) {
      console.log('验证错误详情:', JSON.stringify(error.response.data.details, null, 2));
    }
  }
}

// 运行测试
testSurveyAPI();