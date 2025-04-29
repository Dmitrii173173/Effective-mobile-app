@echo off
echo Сброс пароля для пользователя dmitriiming...
node --env-file=.env --experimental-strip-types D:\project\Effective-mobile-app\reset-password.js
pause