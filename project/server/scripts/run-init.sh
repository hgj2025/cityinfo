#!/bin/bash

echo "CityInfo 数据库初始化脚本"
echo "============================"
echo

# 获取脚本所在目录
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 设置 PostgreSQL 密码（可以通过环境变量覆盖）
export PGPASSWORD=${PGPASSWORD:-postgres}

echo "正在初始化数据库结构..."
psql -U postgres -h localhost -f "$SCRIPTS_DIR/init-database.sql"
if [ $? -ne 0 ]; then
    echo "数据库初始化失败！"
    exit 1
fi

echo
echo "正在插入示例数据..."
psql -U postgres -h localhost -f "$SCRIPTS_DIR/seed-data.sql"
if [ $? -ne 0 ]; then
    echo "示例数据插入失败！"
    exit 1
fi

echo
echo "正在设置用户权限..."
psql -U postgres -h localhost -f "$SCRIPTS_DIR/setup-user.sql"
if [ $? -ne 0 ]; then
    echo "用户权限设置失败！"
    exit 1
fi

echo
echo "============================"
echo "数据库初始化完成！"
echo "============================"
echo
echo "请更新 server/.env 文件中的数据库连接字符串："
echo 'DATABASE_URL="postgresql://cityinfo_app:cityinfo_2024@localhost:5432/cityinfo"'
echo