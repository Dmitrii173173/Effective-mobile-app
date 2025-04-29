@echo off
echo Перезапуск сервера Express...

echo 1. Остановка всех процессов на порту 5003...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":5003" ^| find "LISTENING"') do (
    echo Найден процесс с PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Не удалось завершить процесс %%a
    ) else (
        echo Процесс %%a успешно завершен
    )
)

echo 2. Ожидание освобождения порта...
timeout /t 2 /nobreak >nul

echo 3. Запуск сервера...
start "Express Server" cmd /c "cd /d D:\project\Effective-mobile-app && npm run start"

echo 4. Ожидание запуска сервера...
timeout /t 3 /nobreak >nul

echo 5. Проверка доступности сервера...
powershell -Command "try { Invoke-WebRequest -Uri http://localhost:5003 -Method HEAD -TimeoutSec 5 | Out-Null; Write-Host 'Сервер успешно запущен!' } catch { Write-Host 'Ошибка при проверке сервера. Попробуйте проверить вручную.' }"

echo.
echo Перезапуск завершен! Теперь вы можете открыть:
echo - Простую страницу входа: http://localhost:5003/simple-login.html
echo - Документацию API: http://localhost:5003/api-docs
echo - Фронтенд Next.js: http://localhost:3001/login

pause