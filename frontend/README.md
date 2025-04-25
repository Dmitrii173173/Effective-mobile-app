This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Система работы с обращениями

Данный проект представляет собой полноценную систему для работы с обращениями. Система состоит из бэкенда на Node.js + Express + TypeScript и фронтенда на Next.js + React.

## Структура проекта

```
D:\project\Effective-mobile-app\
  ├── frontend\ (Next.js приложение)
  ├── backend\ (Express API)
  ├── docker-compose.yml
  ├── Dockerfile.backend
  └── Dockerfile.frontend
```

## Запуск проекта

### Вариант 1: Использование Docker Compose (рекомендуется)

1. Убедитесь, что Docker и Docker Compose установлены на вашей системе
2. Перейдите в корневую директорию проекта
3. Запустите контейнеры:

```bash
docker-compose up
```

Это запустит всю инфраструктуру:
- PostgreSQL на порту 5432
- Backend API на порту 3001
- Frontend на порту 3000

### Вариант 2: Ручной запуск

#### Настройка Backend:

1. Перейдите в директорию backend:

```bash
cd backend
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл .env с необходимыми переменными окружения:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tickets_db
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Запустите сервер в режиме разработки:

```bash
npm run dev
```

#### Настройка Frontend:

1. Перейдите в директорию frontend:

```bash
cd frontend
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите приложение в режиме разработки:

```bash
npm run dev
```

## Деплой в Railway

Для деплоя в Railway, выполните следующие шаги:

1. Создайте аккаунт в Railway (если его еще нет)
2. Установите Railway CLI:

```bash
npm install -g @railway/cli
```

3. Войдите в свой аккаунт:

```bash
railway login
```

4. Инициализируйте проект:

```bash
railway init
```

5. Выполните деплой:

```bash
railway up
```

## API Endpoints

Backend API доступен по адресу: http://localhost:3001/api

### Обращения:

- `GET /api/tickets` - Получить список обращений с возможностью фильтрации
- `POST /api/tickets` - Создать обращение
- `PATCH /api/tickets/:id/process` - Взять обращение в работу
- `PATCH /api/tickets/:id/complete` - Завершить обработку обращения
- `PATCH /api/tickets/:id/cancel` - Отменить обращение
- `POST /api/tickets/cancel-in-progress` - Отменить все обращения в статусе "В работе"

## Frontend

Frontend доступен по адресу: http://localhost:3000

## Технологии

### Backend:
- Node.js
- Express.js
- TypeScript
- TypeORM
- PostgreSQL

### Frontend:
- Next.js
- React
- TypeScript
- TailwindCSS
- SWR для управления состоянием

### Инфраструктура:
- Docker
- Docker Compose
- Railway (для деплоя)