-- CityInfo 数据库用户和权限设置脚本
-- 创建应用程序专用数据库用户并设置权限

-- 创建应用程序用户
CREATE USER cityinfo_app WITH PASSWORD 'cityinfo_2024';

-- 创建只读用户（用于数据分析等场景）
CREATE USER cityinfo_readonly WITH PASSWORD 'readonly_2024';

-- 为应用程序用户授予完整权限
GRANT CONNECT ON DATABASE cityinfo TO cityinfo_app;
GRANT USAGE ON SCHEMA public TO cityinfo_app;
GRANT CREATE ON SCHEMA public TO cityinfo_app;

-- 授予所有表的完整权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cityinfo_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cityinfo_app;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO cityinfo_app;

-- 为未来创建的对象设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cityinfo_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cityinfo_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO cityinfo_app;

-- 为只读用户授予查询权限
GRANT CONNECT ON DATABASE cityinfo TO cityinfo_readonly;
GRANT USAGE ON SCHEMA public TO cityinfo_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cityinfo_readonly;

-- 为未来创建的表设置只读权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cityinfo_readonly;

-- 创建备份用户
CREATE USER cityinfo_backup WITH PASSWORD 'backup_2024';
GRANT CONNECT ON DATABASE cityinfo TO cityinfo_backup;
GRANT USAGE ON SCHEMA public TO cityinfo_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cityinfo_backup;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cityinfo_backup;

-- 输出用户创建完成信息
SELECT 'CityInfo 数据库用户和权限设置完成！' AS message;

-- 显示创建的用户
SELECT 
    usename AS username,
    CASE 
        WHEN usesuper THEN 'superuser'
        WHEN usecreatedb THEN 'createdb'
        ELSE 'normal'
    END AS user_type,
    valuntil AS password_expiry
FROM pg_user 
WHERE usename LIKE 'cityinfo_%'
ORDER BY usename;

-- 显示数据库权限
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_catalog = 'cityinfo' 
    AND grantee LIKE 'cityinfo_%'
ORDER BY grantee, privilege_type;