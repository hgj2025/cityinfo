# CityInfo API 文档

## 基础信息

- 基础URL: `http://localhost:3000/api/v1`
- 所有请求和响应均使用JSON格式
- 认证使用Bearer Token方式

## 认证接口

### 注册用户

```
POST /auth/register
```

请求体：
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

响应：
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "用户名"
    },
    "token": "jwt_token"
  }
}
```

### 用户登录

```
POST /auth/login
```

请求体：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "用户名"
    },
    "token": "jwt_token"
  }
}
```

### 获取用户信息

```
GET /auth/profile
```

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "用户名",
      "avatar": "avatar_url"
    }
  }
}
```

## 城市接口

### 获取城市列表

```
GET /cities
```

查询参数：
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）
- `search`: 搜索关键词（可选）

响应：
```json
{
  "status": "success",
  "data": {
    "cities": [
      {
        "id": "city_id",
        "name": "南京",
        "nameEn": "Nanjing",
        "description": "城市描述",
        "image": "city_image_url",
        "location": "城市位置"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### 获取城市详情

```
GET /cities/:id
```

响应：
```json
{
  "status": "success",
  "data": {
    "city": {
      "id": "city_id",
      "name": "南京",
      "nameEn": "Nanjing",
      "description": "城市描述",
      "image": "city_image_url",
      "location": "城市位置",
      "attractions": [],
      "restaurants": [],
      "hotels": []
    }
  }
}
```

## 景点接口

### 获取景点列表

```
GET /attractions
```

查询参数：
- `cityId`: 城市ID（可选）
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）
- `search`: 搜索关键词（可选）

响应：
```json
{
  "status": "success",
  "data": {
    "attractions": [
      {
        "id": "attraction_id",
        "name": "景点名称",
        "nameEn": "Attraction Name",
        "description": "景点描述",
        "image": "image_url",
        "location": "景点位置",
        "price": 50,
        "openTime": "开放时间",
        "cityId": "city_id"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

## 收藏接口

### 添加收藏

```
POST /collections
```

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "itemType": "attraction",
  "itemId": "item_id"
}
```

响应：
```json
{
  "status": "success",
  "data": {
    "collection": {
      "id": "collection_id",
      "userId": "user_id",
      "itemType": "attraction",
      "itemId": "item_id",
      "createdAt": "2024-02-20T12:00:00Z"
    }
  }
}
```

### 获取用户收藏列表

```
GET /collections
```

请求头：
```
Authorization: Bearer <token>
```

查询参数：
- `itemType`: 收藏类型（可选：attraction, restaurant, hotel）
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）

响应：
```json
{
  "status": "success",
  "data": {
    "collections": [
      {
        "id": "collection_id",
        "itemType": "attraction",
        "item": {
          "id": "item_id",
          "name": "项目名称",
          "image": "image_url",
          "description": "项目描述"
        },
        "createdAt": "2024-02-20T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

## 搜索接口

### 全局搜索

```
GET /search
```

查询参数：
- `keyword`: 搜索关键词
- `type`: 搜索类型（可选：city, attraction, restaurant, hotel）
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）

响应：
```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "type": "city",
        "id": "item_id",
        "name": "项目名称",
        "nameEn": "Item Name",
        "description": "项目描述",
        "image": "image_url"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

## 错误响应

当发生错误时，API将返回以下格式的响应：

```json
{
  "status": "error",
  "message": "错误信息"
}
```

常见HTTP状态码：
- 200: 请求成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误