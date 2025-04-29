echo Запуск приложения Effective Mobile App

:: Запуск бэкенда
echo Запуск бэкенда на порту 5003...
start cmd /k "cd D:\project\Effective-mobile-app && npm run start"

:: Запуск фронтенда
echo Запуск фронтенда на порту 3000...
start cmd /k "cd D:\project\Effective-mobile-app\frontend && npm run dev"

echo Приложение запущено:
echo - Бэкенд: http://localhost:5003
echo - Фронтенд: http://localhost:3000
echo - API документация: http://localhost:5003/api-docs
