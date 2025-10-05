# CityInfo 项目 Render 部署指南

本文档详细说明如何将 CityInfo 项目部署到 Render 平台。

## 项目架构

- **前端**: React + TypeScript + Vite (静态站点)
- **后端**: Node.js + Express + TypeScript (Web服务)
- **数据库**: PostgreSQL
- **部署平台**: Render

## 部署前准备

### 1. 代码准备
确保以下文件已正确配置：
- `project/server/render.yaml` - 后端服务配置
- `project/render.yaml` - 前端应用配置
- `project/server/.env.production` - 生产环境变量模板

### 2. GitHub 仓库
将代码推送到 GitHub 仓库，Render 将从此仓库部署。

## 部署步骤

### 第一步：部署数据库

1. 登录 [Render Dashboard](https://dashboard.render.com)
2. 点击 "New +" → "PostgreSQL"
3. 配置数据库：
   - **Name**: `cityinfo-db`
   - **Database**: `cityinfo`
   - **User**: `cityinfo`
   - **Plan**: Starter (免费)
4. 点击 "Create Database"
5. 记录数据库连接信息（稍后配置后端时使用）

### 第二步：部署后端服务

1. 点击 "New +" → "Web Service"
2. 连接 GitHub 仓库
3. 配置服务：
   - **Name**: `cityinfo-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd project/server && chmod +x scripts/deploy.sh && ./scripts/deploy.sh`
   - **Start Command**: `cd project/server && npm start`
   - **Plan**: Starter (免费)

4. 配置环境变量：
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[从第一步创建的数据库获取]
   JWT_SECRET=[生成一个强密码]
   JWT_EXPIRES_IN=7d
   LOG_LEVEL=info
   ALLOWED_ORIGINS=https://cityinfo-frontend.onrender.com
   ```

   **重要：DATABASE_URL 配置说明**
   - 在 Render Dashboard 中，进入你创建的 PostgreSQL 数据库
   - 在 "Info" 标签页中找到 "External Database URL"
   - 复制完整的连接字符串，格式应该是：
     ```
     postgresql://username:password@hostname:port/database_name
     ```
   - 确保连接字符串包含用户名和密码，例如：
     ```
     postgresql://cityinfo_user:your_password@dpg-xxxxx-a.oregon-postgres.render.com:5432/cityinfo_db
     ```

5. 高级设置：
   - **Health Check Path**: `/api/v1/health`
   - **Auto-Deploy**: Yes

6. 点击 "Create Web Service"

### 第三步：部署前端应用

1. 点击 "New +" → "Static Site"
2. 连接同一个 GitHub 仓库
3. 配置站点：
   - **Name**: `cityinfo-frontend`
   - **Build Command**: `cd project && chmod +x scripts/deploy-frontend.sh && ./scripts/deploy-frontend.sh`
   - **Publish Directory**: `project/dist`

4. 配置环境变量：
   ```
   VITE_API_BASE_URL=https://cityinfo-backend.onrender.com/api/v1
   VITE_APP_TITLE=CityInfo - 智能旅游指南
   ```

5. 点击 "Create Static Site"

### 第四步：数据库迁移

后端服务部署完成后，数据库迁移会自动执行。如需手动执行：

1. 在后端服务的 "Shell" 标签页中执行：
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### 第五步：初始化城市数据（可选）

1. 确保 `initcity.json` 文件在 `project/server/scripts/` 目录中
2. 在后端服务的 "Shell" 标签页中执行：
   ```bash
   curl -X POST https://cityinfo-backend.onrender.com/api/v1/cities/initialize-overview \
     -H "Content-Type: application/json" \
     -d @scripts/initcity.json
   ```

## 环境变量配置详解

### 后端环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `10000` |
| `DATABASE_URL` | 数据库连接字符串 | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT密钥 | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT过期时间 | `7d` |
| `LOG_LEVEL` | 日志级别 | `info` |
| `ALLOWED_ORIGINS` | CORS允许的源 | `https://your-frontend.onrender.com` |

### 前端环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端API地址 | `https://your-backend.onrender.com/api/v1` |
| `VITE_APP_TITLE` | 应用标题 | `CityInfo - 智能旅游指南` |

## 部署后验证

### 1. 检查服务状态
- 后端健康检查: `https://cityinfo-backend.onrender.com/api/v1/health`
- 前端访问: `https://cityinfo-frontend.onrender.com`

### 2. 测试API功能
```bash
# 测试城市列表API
curl https://cityinfo-backend.onrender.com/api/v1/cities

# 测试城市初始化API
curl -X POST https://cityinfo-backend.onrender.com/api/v1/cities/initialize-overview \
  -H "Content-Type: application/json" \
  -d '{"city":"测试城市","content":"{}","pictureAdvises":"[]","pictures":"[]"}'
```

## 常见问题

### 1. 构建失败
- 检查 `package.json` 中的构建脚本
- 确保所有依赖都在 `dependencies` 中（不是 `devDependencies`）
- 检查 TypeScript 编译错误

### 2. TypeScript 类型声明错误
如果遇到类似 `Could not find a declaration file for module 'express'` 的错误：
- 确保所有 `@types/*` 包都在 `dependencies` 中而不是 `devDependencies`
- 在生产环境中，Render 默认不安装 `devDependencies`

- 特别需要移动到 `dependencies` 的包：
  - `@types/express`
  - `@types/node`
  - `@types/cors`
  - `@types/morgan`
  - `typescript`
  - `prisma`（用于生成Prisma客户端）
- 使用 `npm ci` 而不是 `npm install` 确保依赖版本一致性
- 如果遇到 `Module '@prisma/client' has no exported member 'PrismaClient'` 错误：
  - 确保 `prisma` 包在 `dependencies` 中
  - 添加 `"postinstall": "npx prisma generate"` 脚本到 `package.json`
  - 确保构建命令中包含 `npx prisma generate`

### 3. Prisma 权限错误
如果遇到 `sh: 1: prisma: Permission denied` 错误：
- 确保在 `package.json` 的 `scripts` 中使用 `npx prisma` 而不是直接的 `prisma`
- 检查 `postinstall` 脚本：应该是 `"postinstall": "npx prisma generate"`
- 确保 `prisma` 包在 `dependencies` 中而不是 `devDependencies`
- 在部署脚本中使用 `npx prisma generate` 和 `npx prisma migrate deploy`

### 4. 数据库连接失败
如果遇到 `FATAL: no PostgreSQL user name specified in startup packet` 错误：
- 检查 `DATABASE_URL` 环境变量是否包含用户名和密码
- 确保 DATABASE_URL 格式正确：`postgresql://username:password@hostname:port/database_name`
- 在 Render Dashboard 的数据库页面复制完整的 "External Database URL"
- 不要使用 "Internal Database URL"，它不包含认证信息
- 确认 `DATABASE_URL` 环境变量正确设置
- 检查数据库服务是否正常运行
- 验证 Prisma 迁移是否成功执行

### 5. CORS 错误
- 确认后端 `ALLOWED_ORIGINS` 包含前端域名
- 检查前端 `VITE_API_BASE_URL` 是否正确

### 6. 静态文件路由问题
- 确认前端配置了 SPA 路由重写规则
- 检查 `dist` 目录是否正确生成

## 数据迁移

### 从本地数据库迁移到 Render

如果你有本地开发数据需要迁移到 Render 的生产数据库，可以使用以下步骤：

#### 1. 导出本地数据

在本地项目目录中运行数据导出脚本：

```bash
# 进入后端目录
cd project/server

# 运行数据导出脚本
node scripts/export-data.js
```

导出脚本将：
- 连接到本地数据库
- 导出所有表的数据为 JSON 格式
- 生成带时间戳的数据文件（如：`cityinfo-data-export-2024-01-01T12-00-00.json`）
- 显示导出统计信息

#### 2. 上传数据文件到 Render

有几种方式将数据文件传输到 Render 服务器：

**方式一：通过 Git 仓库**
```bash
# 将数据文件添加到项目中（临时）
git add project/server/scripts/cityinfo-data-export-*.json
git commit -m "Add data export for migration"
git push origin main
```

**方式二：通过 Render Shell**
- 在 Render Dashboard 中打开后端服务
- 使用 "Shell" 功能上传文件
- 或通过 `curl` 从外部 URL 下载

#### 3. 导入数据到 Render 数据库

在 Render 后端服务的 Shell 中运行：

```bash
# 进入脚本目录
cd scripts

# 运行数据导入脚本
node import-data.js cityinfo-data-export-2024-01-01T12-00-00.json
```

导入脚本将：
- 读取导出的 JSON 数据文件
- 按正确的依赖关系顺序导入数据
- 使用 `upsert` 操作避免重复数据
- 显示导入进度和统计信息

#### 4. 验证数据迁移

导入完成后，验证数据是否正确迁移：

```bash
# 检查数据库连接
npx prisma db pull

# 查看数据统计
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); (async () => { console.log('Users:', await prisma.user.count()); console.log('Cities:', await prisma.city.count()); console.log('Attractions:', await prisma.attraction.count()); await prisma.$disconnect(); })();"
```

#### 5. 清理临时文件

迁移完成后，从 Git 仓库中移除数据文件：

```bash
# 删除数据文件
git rm project/server/scripts/cityinfo-data-export-*.json
git commit -m "Remove temporary data export file"
git push origin main
```

### 注意事项

1. **数据安全**：
   - 数据文件可能包含敏感信息，迁移后及时删除
   - 不要将包含用户数据的文件长期保存在 Git 仓库中

2. **数据一致性**：
   - 确保本地和生产环境使用相同的数据库 schema
   - 运行 `npx prisma db push` 确保 schema 同步

3. **大数据量处理**：
   - 如果数据量很大，考虑分批导入
   - 可以设置环境变量 `CLEAR_EXISTING_DATA=true` 清空现有数据（谨慎使用）

4. **回滚计划**：
   - 在导入前备份 Render 数据库
   - 准备回滚脚本以防导入失败

### 定期数据备份

建议设置定期数据备份：

```bash
# 创建定期备份脚本
echo "0 2 * * * cd /opt/render/project/src/scripts && node export-data.js" | crontab -
```

## 监控和维护

### 1. 日志查看
- 在 Render Dashboard 中查看服务日志
- 后端日志包含 API 请求和错误信息
- 前端构建日志显示编译过程

### 2. 性能监控
- 使用 Render 提供的监控面板
- 关注响应时间和错误率
- 监控数据库连接数和查询性能

### 3. 自动部署
- 推送到 `main` 分支自动触发部署
- 可以在 Render Dashboard 中暂停自动部署
- 支持手动触发重新部署

## 成本优化

### 免费套餐限制
- 静态站点：100GB 带宽/月
- Web 服务：750 小时/月
- PostgreSQL：1GB 存储，90天数据保留

### 升级建议
- 生产环境建议使用付费套餐
- 考虑使用 CDN 加速静态资源
- 定期备份数据库数据

## 安全建议

1. **环境变量安全**
   - 使用强密码作为 JWT_SECRET
   - 定期轮换敏感密钥
   - 不要在代码中硬编码密钥

2. **CORS 配置**
   - 只允许必要的域名
   - 避免使用通配符 `*`

3. **数据库安全**
   - 使用 Render 提供的加密连接
   - 定期更新依赖包
   - 监控异常访问

## 联系支持

如果遇到部署问题：
1. 查看 Render 官方文档
2. 检查服务日志
3. 联系 Render 技术支持
4. 参考项目 GitHub Issues

---

**部署完成后，你的应用将在以下地址可用：**
- 前端: `https://cityinfo-frontend.onrender.com`
- 后端: `https://cityinfo-backend.onrender.com`
- API文档: `https://cityinfo-backend.onrender.com/api/v1/health`