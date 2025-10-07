# 端口配置说明

## 固定端口配置

为了避免端口冲突和配置混乱，本项目采用固定端口配置：

### 开发环境端口
- **前端开发服务器**: `5174`
- **后端API服务器**: `3001`
- **Prisma Studio**: `5555`

### 环境变量配置

#### 后端 (server/.env)
```env
PORT=3001
NODE_ENV=development
```

#### 前端 (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_BACKEND_PORT=3001
VITE_FRONTEND_PORT=5174
```

### 配置文件说明

1. **后端端口配置**
   - `server/src/index.ts`: 默认端口设置为 3001
   - `server/.env`: 明确指定 PORT=3001
   - `server/.env.example`: 示例配置也设置为 3001

2. **前端端口配置**
   - `vite.config.ts`: 使用环境变量配置端口和代理
   - `src/services/api.ts`: 使用环境变量配置API基础URL
   - `src/services/surveyService.ts`: 使用环境变量配置API基础URL

3. **代理配置**
   - Vite开发服务器配置了 `/api` 路径代理到后端服务器
   - 前端组件使用相对路径 `/api/v1` 进行API调用

### 启动方式

#### 方式一：使用启动脚本
```powershell
.\start-dev.ps1
```

#### 方式二：手动启动
```powershell
# 启动后端
cd server
npm run dev

# 启动前端（新终端）
cd ..
npm run dev
```

### 注意事项

1. **不要硬编码端口**: 所有端口配置都通过环境变量管理
2. **保持配置一致**: 确保所有配置文件中的端口设置一致
3. **使用相对路径**: 前端API调用使用相对路径，由Vite代理处理
4. **环境变量优先**: 代码中优先使用环境变量，提供默认值作为后备

### 端口冲突解决

如果遇到端口被占用的问题：

```powershell
# 查找占用端口的进程
netstat -ano | findstr :3001
netstat -ano | findstr :5174

# 终止进程
taskkill /PID <进程ID> /F
```

### 生产环境

生产环境端口配置请参考 `server/.env.production` 文件。