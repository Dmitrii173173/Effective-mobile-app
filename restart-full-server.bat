@echo off
echo.
echo ===================================================
echo    ПОЛНЫЙ ПЕРЕЗАПУСК СЕРВЕРА EFFECTIVE MOBILE APP
echo ===================================================
echo.

echo 1. Проверка файловой структуры...
if not exist "D:\project\Effective-mobile-app\public\css\" (
    echo Создание директории CSS...
    mkdir "D:\project\Effective-mobile-app\public\css" 2>nul
)

echo 2. Проверка существования необходимых файлов...
set MISSING_FILES=0

if not exist "D:\project\Effective-mobile-app\public\css\main.css" (
    echo ОТСУТСТВУЕТ: main.css
    set MISSING_FILES=1
)

if not exist "D:\project\Effective-mobile-app\public\index.html" (
    echo ОТСУТСТВУЕТ: index.html
    set MISSING_FILES=1
)

if not exist "D:\project\Effective-mobile-app\public\login.html" (
    echo ОТСУТСТВУЕТ: login.html
    set MISSING_FILES=1
)

if not exist "D:\project\Effective-mobile-app\public\register.html" (
    echo ОТСУТСТВУЕТ: register.html
    set MISSING_FILES=1
)

if not exist "D:\project\Effective-mobile-app\public\dashboard.html" (
    echo ОТСУТСТВУЕТ: dashboard.html
    set MISSING_FILES=1
)

if not exist "D:\project\Effective-mobile-app\src\routes\simpleAuthRoutes.js" (
    echo ОТСУТСТВУЕТ: simpleAuthRoutes.js
    set MISSING_FILES=1
)

if %MISSING_FILES%==1 (
    echo.
    echo ВНИМАНИЕ! Отсутствуют некоторые файлы. Пожалуйста, восстановите их перед перезапуском.
    echo.
    pause
    exit /b
)

echo Все необходимые файлы найдены.

echo.
echo 3. Остановка всех процессов на порту 5003...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":5003" ^| find "LISTENING"') do (
    echo Найден процесс с PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Не удалось завершить процесс %%a
    ) else (
        echo Процесс %%a успешно завершен
    )
)

echo.
echo 4. Ожидание освобождения порта...
timeout /t 2 /nobreak >nul

echo.
echo 5. Запуск сервера...
cd /d D:\project\Effective-mobile-app
start "Express Server" cmd /c "cd /d D:\project\Effective-mobile-app && npm run start"

echo.
echo 6. Ожидание запуска сервера...
timeout /t 3 /nobreak >nul

echo.
echo 7. Проверка доступности сервера...
ping -n 1 localhost:5003 >nul 2>&1
if errorlevel 1 (
    echo Сервер запускается... Пожалуйста, подождите.
) else (
    echo Сервер доступен!
)

echo.
echo ===================================================
echo            СЕРВЕР УСПЕШНО ПЕРЕЗАПУЩЕН!
echo ===================================================
echo.
echo Теперь вы можете открыть:
echo - Основной сайт: http://localhost:5003
echo - Страница входа: http://localhost:5003/login.html
echo - Простая страница входа: http://localhost:5003/simple-login.html
echo - Документация API: http://localhost:5003/api-docs
echo.
echo Данные для входа:
echo Логин: dmitriiming
echo Пароль: 007dd007dd
echo.

pause