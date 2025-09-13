-- CityInfo 数据库初始化脚本
-- 创建数据库和基础配置

-- 创建数据库
CREATE DATABASE cityinfo
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Chinese (Simplified)_China.936'
    LC_CTYPE = 'Chinese (Simplified)_China.936'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- 连接到cityinfo数据库
\c cityinfo;

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    avatar TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建城市表
CREATE TABLE "City" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    location TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建景点表
CREATE TABLE "Attraction" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    location TEXT NOT NULL,
    price DOUBLE PRECISION,
    "openTime" TEXT,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attraction_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 创建餐厅表
CREATE TABLE "Restaurant" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    location TEXT NOT NULL,
    "priceRange" TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Restaurant_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 创建酒店表
CREATE TABLE "Hotel" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    location TEXT NOT NULL,
    "priceRange" TEXT NOT NULL,
    stars INTEGER NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Hotel_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 创建收藏表
CREATE TABLE "Collection" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Collection_userId_itemType_itemId_key" UNIQUE ("userId", "itemType", "itemId")
);

-- 创建索引
CREATE INDEX "User_email_idx" ON "User"(email);
CREATE INDEX "City_name_idx" ON "City"(name);
CREATE INDEX "City_location_idx" ON "City"(location);
CREATE INDEX "Attraction_cityId_idx" ON "Attraction"("cityId");
CREATE INDEX "Attraction_name_idx" ON "Attraction"(name);
CREATE INDEX "Restaurant_cityId_idx" ON "Restaurant"("cityId");
CREATE INDEX "Restaurant_cuisine_idx" ON "Restaurant"(cuisine);
CREATE INDEX "Hotel_cityId_idx" ON "Hotel"("cityId");
CREATE INDEX "Hotel_stars_idx" ON "Hotel"(stars);
CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");
CREATE INDEX "Collection_itemType_idx" ON "Collection"("itemType");

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间触发器
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_updated_at BEFORE UPDATE ON "City" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attraction_updated_at BEFORE UPDATE ON "Attraction" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_updated_at BEFORE UPDATE ON "Restaurant" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_updated_at BEFORE UPDATE ON "Hotel" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 输出初始化完成信息
SELECT 'CityInfo 数据库初始化完成！' AS message;