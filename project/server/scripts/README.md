# CityInfo 数据库初始化脚本

本目录包含了 CityInfo 项目的 PostgreSQL 数据库初始化脚本，用于快速搭建和配置项目所需的数据库环境。

## 脚本文件说明

### 1. `init-database.sql`
**数据库结构初始化脚本**
- 创建 `cityinfo` 数据库
- 启用 UUID 扩展
- 创建所有数据表（User、City、Attraction、Restaurant、Hotel、Collection）
- 设置外键约束和索引
- 创建自动更新时间戳的触发器

### 2. `seed-data.sql`
**示例数据插入脚本**
- 插入 6 个示例城市（北京、上海、广州、深圳、杭州、成都）
- 插入相关的景点、餐厅、酒店数据
- 创建测试用户账户
- 添加示例收藏数据

### 3. `setup-user.sql`
**用户权限配置脚本**
- 创建应用程序专用用户 `cityinfo_app`
- 创建只读用户 `cityinfo_readonly`
- 创建备份用户 `cityinfo_backup`
- 配置相应的数据库权限

## 使用方法

### 前提条件
1. 已安装 PostgreSQL 数据库服务器
2. 具有创建数据库和用户的权限（通常使用 postgres 超级用户）

### 初始化步骤

#### 方法一：使用 psql 命令行工具

```bash
# 1. 以 postgres 用户身份连接数据库
psql -U postgres -h localhost

# 2. 执行初始化脚本
\i /path/to/init-database.sql

# 3. 插入示例数据（可选）
\i /path/to/seed-data.sql

# 4. 设置用户权限
\i /path/to/setup-user.sql
```

#### 方法二：使用批处理命令

```bash
# Windows PowerShell
psql -U postgres -h localhost -f "d:/code/cityinfo/project/server/scripts/init-database.sql"
psql -U postgres -h localhost -f "d:/code/cityinfo/project/server/scripts/seed-data.sql"
psql -U postgres -h localhost -f "d:/code/cityinfo/project/server/scripts/setup-user.sql"

# Linux/macOS
psql -U postgres -h localhost -f "/path/to/init-database.sql"
psql -U postgres -h localhost -f "/path/to/seed-data.sql"
psql -U postgres -h localhost -f "/path/to/setup-user.sql"
```

### 环境配置

初始化完成后，需要更新项目的环境配置文件：

```env
# server/.env
DATABASE_URL="postgresql://cityinfo_app:cityinfo_2024@localhost:5432/cityinfo"
PORT=3000
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"
LOG_LEVEL="info"
ALLOWED_ORIGINS="http://localhost:5173"
```

### 验证安装

```sql
-- 连接到 cityinfo 数据库
\c cityinfo;

-- 检查表是否创建成功
\dt

-- 检查数据是否插入成功
SELECT COUNT(*) FROM "City";
SELECT COUNT(*) FROM "Attraction";
SELECT COUNT(*) FROM "Restaurant";
SELECT COUNT(*) FROM "Hotel";
```

## 数据库结构说明

### 核心表结构

- **User**: 用户表，存储用户账户信息
- **City**: 城市表，存储城市基本信息
- **Attraction**: 景点表，关联到城市
- **Restaurant**: 餐厅表，关联到城市
- **Hotel**: 酒店表，关联到城市
- **Collection**: 收藏表，用户收藏的景点/餐厅/酒店

### 关系说明

- 一个城市可以有多个景点、餐厅、酒店
- 一个用户可以收藏多个项目
- 收藏表通过 `itemType` 和 `itemId` 实现多态关联

## 安全注意事项

1. **修改默认密码**: 生产环境中务必修改脚本中的默认密码
2. **限制网络访问**: 配置 PostgreSQL 的 `pg_hba.conf` 限制访问来源
3. **定期备份**: 建议设置自动备份策略
4. **权限最小化**: 应用程序只使用 `cityinfo_app` 用户，避免使用超级用户

## 故障排除

### 常见问题

1. **连接被拒绝**
   ```
   psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed
   ```
   - 检查 PostgreSQL 服务是否启动
   - 确认端口 5432 是否开放

2. **权限不足**
   ```
   ERROR: permission denied to create database
   ```
   - 确保使用具有创建数据库权限的用户（如 postgres）

3. **数据库已存在**
   ```
   ERROR: database "cityinfo" already exists
   ```
   - 删除现有数据库：`DROP DATABASE cityinfo;`
   - 或者跳过数据库创建步骤

### 重置数据库

如需重新初始化数据库：

```sql
-- 删除数据库（注意：这会删除所有数据）
DROP DATABASE IF EXISTS cityinfo;

-- 删除用户
DROP USER IF EXISTS cityinfo_app;
DROP USER IF EXISTS cityinfo_readonly;
DROP USER IF EXISTS cityinfo_backup;

-- 重新执行初始化脚本
```

## 维护建议

1. **定期更新统计信息**: `ANALYZE;`
2. **监控数据库大小**: 定期检查表和索引大小
3. **日志监控**: 关注 PostgreSQL 日志中的错误和警告
4. **性能优化**: 根据查询模式调整索引策略

## 联系支持

如遇到问题，请检查：
1. PostgreSQL 版本兼容性（推荐 12+）
2. 系统资源是否充足
3. 网络连接是否正常

---

*最后更新时间: 2024年*