@echo off
echo Проверка состояния сервера на порту 5003...
cd /d D:\project\Effective-mobile-app
node --experimental-strip-types D:\project\Effective-mobile-app\check-server-status.js
pause