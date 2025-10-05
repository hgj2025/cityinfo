#!/bin/bash

# 前端部署脚本
# 此脚本在Render平台上自动执行

echo "开始部署CityInfo前端应用..."

# 安装依赖
echo "安装依赖包..."
npm install

# 构建生产版本
echo "构建生产版本..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
  echo "构建成功！输出目录: dist/"
  echo "构建文件列表:"
  ls -la dist/
else
  echo "构建失败！dist目录不存在"
  exit 1
fi

echo "前端部署完成！"