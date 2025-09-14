# CityInfo 项目启动指南

本项目提供了多种启动脚本，方便快速启动前后端服务。

## 🚀 快速启动

### Windows 用户

#### 启动所有服务（推荐）
```bash
# 双击运行或在命令行执行
start-all.bat
```

#### 单独启动服务
```bash
# 启动后端服务
start-backend.bat

# 启动前端服务
start-frontend.bat
```

### Linux/macOS 用户

#### 启动所有服务（推荐）
```bash
# 添加执行权限（首次运行）
chmod +x *.sh

# 启动所有服务
./start-all.sh
```

#### 单独启动服务
```bash
# 启动后端服务
./start-backend.sh

# 启动前端服务
./start-frontend.sh
```

## 📋 启动流程说明

### 后端服务启动流程
1. 安装依赖包 (`npm install`)
2. 生成 Prisma 客户端 (`npx prisma generate`)
3. 编译 TypeScript (`npm run build`)
4. 启动服务器 (`npm start`)

### 前端服务启动流程
1. 安装依赖包 (`npm install`)
2. 启动开发服务器 (`npm run dev`)

## 🌐 访问地址

启动成功后，可以通过以下地址访问：

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **API 文档**: http://localhost:3000/api/v1/cities

## ⚠️ 注意事项

1. **首次运行**：确保已安装 Node.js (版本 >= 16)
2. **环境变量**：后端需要配置 `.env` 文件（参考 `server/.env.example`）
3. **数据库**：确保数据库连接正常
4. **端口占用**：如果端口被占用，请先关闭占用端口的程序

## 🛠️ 手动启动（开发者）

如果自动脚本出现问题，可以手动启动：

### 后端
```bash
cd server
npm install
npx prisma generate
npm run build
npm start
```

### 前端
```bash
# 在项目根目录
npm install
npm run dev
```

## 🔧 故障排除

### 常见问题

1. **依赖安装失败**
   - 删除 `node_modules` 文件夹
   - 重新运行 `npm install`

2. **Prisma 客户端错误**
   - 运行 `npx prisma generate`
   - 检查数据库连接

3. **端口占用**
   - 检查端口 3000 和 5173 是否被占用
   - 使用 `netstat -ano | findstr :3000` (Windows) 或 `lsof -i :3000` (Linux/macOS) 查看

4. **TypeScript 编译错误**
   - 检查代码语法
   - 运行 `npm run build` 查看详细错误信息

## 📞 获取帮助

如果遇到问题，请检查：
1. Node.js 版本是否符合要求
2. 网络连接是否正常
3. 环境变量配置是否正确
4. 数据库服务是否启动