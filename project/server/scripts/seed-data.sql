-- CityInfo 示例数据插入脚本
-- 为系统添加初始数据

-- 连接到cityinfo数据库
\c cityinfo;

-- 插入城市数据
INSERT INTO "City" (id, name, "nameEn", description, image, location) VALUES
('550e8400-e29b-41d4-a716-446655440001', '北京', 'Beijing', '中华人民共和国首都，历史文化名城，拥有众多世界文化遗产。', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', '北京市'),
('550e8400-e29b-41d4-a716-446655440002', '上海', 'Shanghai', '中国最大的经济中心，国际化大都市，东方明珠。', 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800', '上海市'),
('550e8400-e29b-41d4-a716-446655440003', '广州', 'Guangzhou', '千年商都，岭南文化中心，美食之都。', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', '广东省广州市'),
('550e8400-e29b-41d4-a716-446655440004', '深圳', 'Shenzhen', '改革开放的窗口，科技创新之城，年轻活力的现代化城市。', 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800', '广东省深圳市'),
('550e8400-e29b-41d4-a716-446655440005', '杭州', 'Hangzhou', '人间天堂，西湖美景，电商之都。', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', '浙江省杭州市'),
('550e8400-e29b-41d4-a716-446655440006', '成都', 'Chengdu', '天府之国，熊猫故乡，美食天堂，休闲之都。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '四川省成都市');

-- 插入景点数据
INSERT INTO "Attraction" (id, name, "nameEn", description, image, location, price, "openTime", "cityId") VALUES
-- 北京景点
('650e8400-e29b-41d4-a716-446655440001', '故宫博物院', 'Forbidden City', '明清两代的皇家宫殿，世界文化遗产，中国古代宫廷建筑之精华。', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600', '北京市东城区景山前街4号', 60.0, '08:30-17:00', '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440002', '天安门广场', 'Tiananmen Square', '世界最大的城市广场之一，中华人民共和国的象征。', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600', '北京市东城区东长安街', 0.0, '全天开放', '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440003', '长城', 'Great Wall', '世界文化遗产，中华民族的象征，万里长城永不倒。', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600', '北京市延庆区八达岭镇', 45.0, '06:30-19:00', '550e8400-e29b-41d4-a716-446655440001'),
-- 上海景点
('650e8400-e29b-41d4-a716-446655440004', '外滩', 'The Bund', '上海的标志性景观，万国建筑博览群，黄浦江畔的明珠。', 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600', '上海市黄浦区中山东一路', 0.0, '全天开放', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440005', '东方明珠', 'Oriental Pearl Tower', '上海的地标建筑，亚洲第一、世界第三高的电视塔。', 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600', '上海市浦东新区世纪大道1号', 220.0, '08:00-21:30', '550e8400-e29b-41d4-a716-446655440002'),
-- 杭州景点
('650e8400-e29b-41d4-a716-446655440006', '西湖', 'West Lake', '世界文化遗产，中国最著名的湖泊之一，人间天堂。', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', '浙江省杭州市西湖区', 0.0, '全天开放', '550e8400-e29b-41d4-a716-446655440005');

-- 插入餐厅数据
INSERT INTO "Restaurant" (id, name, "nameEn", description, image, location, "priceRange", cuisine, "cityId") VALUES
-- 北京餐厅
('750e8400-e29b-41d4-a716-446655440001', '全聚德烤鸭店', 'Quanjude Roast Duck', '百年老字号，北京烤鸭的代表，享誉海内外。', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', '北京市东城区前门大街30号', '200-500元', '京菜', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440002', '东来顺', 'Donglaishun', '百年涮羊肉老字号，铜锅涮肉的鼻祖。', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', '北京市东城区王府井大街198号', '150-300元', '火锅', '550e8400-e29b-41d4-a716-446655440001'),
-- 上海餐厅
('750e8400-e29b-41d4-a716-446655440003', '南翔馒头店', 'Nanxiang Steamed Bun Restaurant', '上海小笼包的发源地，百年传承的美味。', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', '上海市黄浦区豫园路85号', '50-150元', '沪菜', '550e8400-e29b-41d4-a716-446655440002'),
-- 广州餐厅
('750e8400-e29b-41d4-a716-446655440004', '陶陶居', 'Taotaoju', '广州老字号茶楼，正宗粤式茶点。', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', '广东省广州市荔湾区第十甫路20号', '100-250元', '粤菜', '550e8400-e29b-41d4-a716-446655440003'),
-- 成都餐厅
('750e8400-e29b-41d4-a716-446655440005', '陈麻婆豆腐', 'Chen Mapo Tofu', '麻婆豆腐的发源地，川菜经典代表。', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', '四川省成都市青羊区西玉龙街197号', '80-200元', '川菜', '550e8400-e29b-41d4-a716-446655440006');

-- 插入酒店数据
INSERT INTO "Hotel" (id, name, "nameEn", description, image, location, "priceRange", stars, "cityId") VALUES
-- 北京酒店
('850e8400-e29b-41d4-a716-446655440001', '北京饭店', 'Beijing Hotel', '历史悠久的豪华酒店，位于王府井商业区核心。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '北京市东城区东长安街33号', '800-2000元', 5, '550e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440002', '王府井希尔顿酒店', 'Hilton Beijing Wangfujing', '国际连锁五星级酒店，服务优质，位置便利。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '北京市东城区王府井大街8号', '600-1500元', 5, '550e8400-e29b-41d4-a716-446655440001'),
-- 上海酒店
('850e8400-e29b-41d4-a716-446655440003', '和平饭店', 'Peace Hotel', '上海滩传奇酒店，Art Deco建筑风格，历史文化底蕴深厚。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '上海市黄浦区南京东路20号', '1000-3000元', 5, '550e8400-e29b-41d4-a716-446655440002'),
('850e8400-e29b-41d4-a716-446655440004', '浦东香格里拉', 'Pudong Shangri-La', '豪华五星级酒店，俯瞰黄浦江美景。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '上海市浦东新区富城路33号', '800-2500元', 5, '550e8400-e29b-41d4-a716-446655440002'),
-- 杭州酒店
('850e8400-e29b-41d4-a716-446655440005', '西湖国宾馆', 'West Lake State Guest House', '坐落西湖湖畔，环境优美，服务一流。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '浙江省杭州市西湖区杨公堤18号', '600-1800元', 5, '550e8400-e29b-41d4-a716-446655440005'),
-- 深圳酒店
('850e8400-e29b-41d4-a716-446655440006', '深圳瑞吉酒店', 'The St. Regis Shenzhen', '奢华五星级酒店，现代化设施完善。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '广东省深圳市福田区深南大道5016号', '700-2000元', 5, '550e8400-e29b-41d4-a716-446655440004');

-- 插入测试用户数据
INSERT INTO "User" (id, email, password, name, avatar) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'admin@cityinfo.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', '管理员', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('950e8400-e29b-41d4-a716-446655440002', 'user@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', '测试用户', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150');

-- 插入一些收藏数据
INSERT INTO "Collection" (id, "userId", "itemType", "itemId") VALUES
('a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440002', 'attraction', '650e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 'restaurant', '750e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440002', 'hotel', '850e8400-e29b-41d4-a716-446655440001');

-- 输出数据插入完成信息
SELECT 'CityInfo 示例数据插入完成！' AS message;
SELECT 
    (SELECT COUNT(*) FROM "City") AS cities_count,
    (SELECT COUNT(*) FROM "Attraction") AS attractions_count,
    (SELECT COUNT(*) FROM "Restaurant") AS restaurants_count,
    (SELECT COUNT(*) FROM "Hotel") AS hotels_count,
    (SELECT COUNT(*) FROM "User") AS users_count,
    (SELECT COUNT(*) FROM "Collection") AS collections_count;