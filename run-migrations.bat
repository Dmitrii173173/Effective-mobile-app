@echo off
echo Выполнение миграций Prisma...
cd /d D:\project\Effective-mobile-app
npx prisma migrate dev --name init
pause