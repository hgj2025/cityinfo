@echo off
echo CityInfo 数据库初始化脚本
echo ============================
echo.

set PGPASSWORD=postgres
set SCRIPTS_DIR=%~dp0

echo 正在初始化数据库结构...
psql -U postgres -h localhost -f "%SCRIPTS_DIR%init-database.sql"
if %ERRORLEVEL% neq 0 (
    echo 数据库初始化失败！
    pause
    exit /b 1
)

echo.
echo 正在插入示例数据...
psql -U postgres -h localhost -f "%SCRIPTS_DIR%seed-data.sql"
if %ERRORLEVEL% neq 0 (
    echo 示例数据插入失败！
    pause
    exit /b 1
)

echo.
echo 正在设置用户权限...
psql -U postgres -h localhost -f "%SCRIPTS_DIR%setup-user.sql"
if %ERRORLEVEL% neq 0 (
    echo 用户权限设置失败！
    pause
    exit /b 1
)

echo.
echo ============================
echo 数据库初始化完成！
echo ============================
echo.
echo 请更新 server/.env 文件中的数据库连接字符串：
echo DATABASE_URL="postgresql://cityinfo_app:cityinfo_2024@localhost:5432/cityinfo"
echo.
pause