#!/bin/bash

# Render部署脚本
# 此脚本在Render平台上自动执行

echo "开始部署CityInfo后端服务..."

# 安装依赖
echo "安装依赖包..."
npm ci

# 构建TypeScript
echo "构建TypeScript代码..."
npm run build

# 生成Prisma客户端
echo "生成Prisma客户端..."
npx prisma generate

# 运行数据库迁移
echo "运行数据库迁移..."
npx prisma migrate deploy

# 初始化城市数据（可选）
if [ "$INIT_CITY_DATA" = "true" ]; then
  echo "初始化城市数据..."
  node -e "
    const fs = require('fs');
    const path = require('path');
    const axios = require('axios');
    
    async function initCityData() {
      try {
        const initDataPath = path.join(__dirname, 'scripts', 'initcity.json');
        if (fs.existsSync(initDataPath)) {
          const initData = JSON.parse(fs.readFileSync(initDataPath, 'utf8'));
          const response = await axios.post('http://localhost:' + (process.env.PORT || 10000) + '/api/v1/cities/initialize-overview', initData);
          console.log('城市数据初始化成功:', response.data.message);
        }
      } catch (error) {
        console.log('城市数据初始化失败:', error.message);
      }
    }
    
    setTimeout(initCityData, 5000);
  "
fi

echo "部署完成！"