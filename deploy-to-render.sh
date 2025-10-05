#!/bin/bash

# CityInfo 项目 Render 部署准备脚本
# 此脚本帮助准备部署到 Render 平台所需的文件

echo "🚀 CityInfo 项目 Render 部署准备"
echo "================================="

# 检查必要文件
echo "📋 检查项目文件..."

required_files=(
    "project/package.json"
    "project/server/package.json"
    "project/server/prisma/schema.prisma"
    "project/server/.env.example"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查部署配置文件
echo "\n🔧 检查部署配置文件..."

config_files=(
    "project/server/render.yaml"
    "project/render.yaml"
    "project/server/.env.production"
    "RENDER_DEPLOYMENT.md"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 已创建"
    else
        echo "❌ $file 缺失"
    fi
done

# 检查脚本文件
echo "\n📜 检查部署脚本..."

script_files=(
    "project/server/scripts/deploy.sh"
    "project/scripts/deploy-frontend.sh"
)

for file in "${script_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 已创建"
        chmod +x "$file"
    else
        echo "❌ $file 缺失"
    fi
done


# 检查环境变量
echo "\n🔐 环境变量检查清单:"
echo "后端需要设置的环境变量："
echo "  - NODE_ENV=production"
echo "  - PORT=10000"
echo "  - DATABASE_URL=[Render数据库提供]"
echo "  - JWT_SECRET=[生成强密码]"
echo "  - JWT_EXPIRES_IN=7d"
echo "  - LOG_LEVEL=info"
echo "  - ALLOWED_ORIGINS=https://your-frontend.onrender.com"
echo ""
echo "前端需要设置的环境变量："
echo "  - VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1"
echo "  - VITE_APP_TITLE=CityInfo - 智能旅游指南"

# 生成部署清单
echo "\n📝 生成部署清单..."
cat > DEPLOYMENT_CHECKLIST.md << EOF
# CityInfo Render 部署清单

## 部署前检查
- [ ] 代码已推送到 GitHub
- [ ] 所有配置文件已创建
- [ ] 环境变量已准备
- [ ] 数据库迁移文件已准备

## 部署步骤
1. [ ] 创建 PostgreSQL 数据库
2. [ ] 部署后端服务
3. [ ] 配置后端环境变量
4. [ ] 部署前端应用
5. [ ] 配置前端环境变量
6. [ ] 验证服务运行状态
7. [ ] 初始化城市数据（可选）

## 验证清单
- [ ] 后端健康检查通过
- [ ] 前端页面正常加载
- [ ] API 接口正常响应
- [ ] 数据库连接正常
- [ ] CORS 配置正确

## 部署后
- [ ] 监控服务状态
- [ ] 检查日志输出
- [ ] 测试核心功能
- [ ] 备份重要数据
EOF

echo "✅ 部署清单已生成: DEPLOYMENT_CHECKLIST.md"

echo "\n🎉 部署准备完成！"
echo "\n📖 下一步："
echo "1. 阅读 RENDER_DEPLOYMENT.md 了解详细部署步骤"
echo "2. 将代码推送到 GitHub 仓库"
echo "3. 在 Render 平台创建服务"
echo "4. 按照 DEPLOYMENT_CHECKLIST.md 执行部署"
echo "\n🔗 有用的链接："
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Render 文档: https://render.com/docs"
echo "- 项目部署指南: ./RENDER_DEPLOYMENT.md"

echo "\n✨ 祝你部署顺利！"