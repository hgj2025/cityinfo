# 开发环境启动脚本
Write-Host "启动城市信息系统开发环境..." -ForegroundColor Green

# 检查端口是否被占用
$backendPort = 3001
$frontendPort = 5174

Write-Host "检查端口占用情况..." -ForegroundColor Yellow

# 检查后端端口
$backendProcess = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
if ($backendProcess) {
    Write-Host "端口 $backendPort 已被占用，正在终止相关进程..." -ForegroundColor Yellow
    $processId = $backendProcess.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 检查前端端口
$frontendProcess = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue
if ($frontendProcess) {
    Write-Host "端口 $frontendPort 已被占用，正在终止相关进程..." -ForegroundColor Yellow
    $processId = $frontendProcess.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "启动后端服务器 (端口: $backendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev" -WindowStyle Normal

Write-Host "等待后端服务器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "启动前端开发服务器 (端口: $frontendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host "开发环境启动完成!" -ForegroundColor Green
Write-Host "前端地址: http://localhost:$frontendPort" -ForegroundColor White
Write-Host "后端API: http://localhost:$backendPort" -ForegroundColor White
Write-Host "按任意键退出..." -ForegroundColor Gray
Read-Host