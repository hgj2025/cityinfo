# 项目开发规则

## API测试规范

### Windows PowerShell环境
在Windows环境下进行API测试时，应使用PowerShell的原生命令而不是curl：

#### 推荐使用
```powershell
# GET请求
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoint" -Method GET

# POST请求（带JSON数据）
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoint" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"key": "value"}'

# PUT请求
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoint" -Method PUT -Headers @{"Content-Type"="application/json"} -Body '{"key": "value"}'

# DELETE请求
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoint" -Method DELETE
```

#### 避免使用
```bash
# 在Windows PowerShell中避免使用curl语法
curl -X POST http://localhost:3001/api/endpoint -H "Content-Type: application/json" -d '{"key": "value"}'
```

#### 原因
- Windows PowerShell中的curl是`Invoke-WebRequest`的别名，语法与Linux/macOS的curl不同
- 使用`Invoke-RestMethod`可以避免参数转换错误
- `Invoke-RestMethod`会自动解析JSON响应，更适合API测试

## 开发环境

### 端口配置
- 前端开发服务器：http://localhost:5174
- 后端API服务器：http://localhost:3001
- Prisma Studio：http://localhost:5555

### 服务启动
- 后端服务：`npm run dev` (在 project/server 目录)
- 前端服务：`npm run dev` (在 project 目录)
- 数据库管理：`npx prisma studio` (在 project/server 目录)