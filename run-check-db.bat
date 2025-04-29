@echo off
echo Проверка состояния базы данных...
cd /d D:\project\Effective-mobile-app
node --experimental-strip-types D:\project\Effective-mobile-app\check-database.js
pause