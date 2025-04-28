# Система обращений - Effective Mobile App

Полноценное веб-приложение для управления задачами и обращениями с авторизацией пользователей.

## Особенности

- **Система обращений**: создание и управление обращениями с различными статусами
- **Задачи**: список задач для авторизованных пользователей
- **API документация**: Swagger UI для простого тестирования API
- **Современный UI**: фронтенд на React с использованием Next.js и Tailwind CSS

## Структура проекта

### Бэкенд (Express.js + PostgreSQL + Prisma)

```
src/
├── middleware/       # Промежуточное ПО Express
│   └── authMiddleware.js
├── routes/           # Маршруты API
│   ├── appealsRoutes.js  # Маршруты для обращений
│   ├── authRoutes.js     # Маршруты для аутентификации
│   └── todoRoutes.js     # Маршруты для задач
├── db.js             # Настройки базы данных
├── prismaClient.js   # Клиент Prisma для работы с БД
├── server.js         # Основной файл сервера
└── swagger.js        # Конфигурация Swagger для документации API

prisma/               # Настройки Prisma ORM
├── migrations/       # Миграции базы данных
└── schema.prisma     # Схема данных Prisma

public/               # Статические файлы
```

### Фронтенд (Next.js)

```
frontend/
├── src/
│   ├── app/          # Страницы приложения
│   │   ├── appeals/  # Страницы для обращений
│   │   ├── dashboard/# Страница для авторизованных пользователей
│   │   ├── login/    # Страница авторизации
│   │   ├── register/ # Страница регистрации
│   │   ├── globals.css # Глобальные стили
│   │   ├── layout.tsx  # Корневой layout
│   │   └── page.tsx    # Главная страница
│   ├── components/  # Компоненты React
│   │   ├── AppealCard.tsx
│   │   ├── AppealFilter.tsx
│   │   ├── AppealForm.tsx
│   │   ├── CancelAllAppealsModal.tsx
│   │   ├── Header.tsx
│   │   └── TodoItem.tsx
│   └── lib/         # Утилиты и контексты
│       ├── api.ts   # API клиент
│       └── auth-context.tsx # Контекст авторизации
├── public/         # Статические файлы
├── package.json    # Зависимости проекта
└── tailwind.config.js # Конфигурация Tailwind
```

## API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация нового пользователя
- `POST /auth/login` - Авторизация пользователя

### Задачи (защищены авторизацией)
- `GET /todos` - Получить все задачи пользователя
- `POST /todos` - Создать новую задачу
- `PATCH /todos/:id` - Обновить задачу
- `DELETE /todos/:id` - Удалить задачу

### Обращения (не требуют авторизации)
- `POST /appeals` - Создать новое обращение
- `GET /appeals` - Получить список обращений с возможностью фильтрации по датам
- `PATCH /appeals/:id/process` - Взять обращение в работу
- `PATCH /appeals/:id/complete` - Завершить обработку обращения
- `PATCH /appeals/:id/cancel` - Отмена обращения
- `PATCH /appeals/cancel-all-in-progress` - Отменить все обращения в статусе "в работе"

## Начало работы

### Настройка базы данных (PostgreSQL)

1. Установите и запустите PostgreSQL
2. Создайте базу данных:
```sql
CREATE DATABASE todoapp;
```

### Настройка .env файла
Создайте файл `.env` в корне проекта:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/todoapp"
JWT_SECRET="your_secret_key_here"
PORT=5003
```

Замените `yourpassword` на ваш пароль от PostgreSQL.

### Запуск бэкенда

1. Установите зависимости:
```bash
npm install
```

2. Выполните миграции Prisma:
```bash
npx prisma migrate dev
```

3. Запустите сервер:
```bash
npm run dev
```

Сервер запустится на порту 5003 (или на порту, указанном в .env). API документация будет доступна по адресу http://localhost:5003/api-docs

### Запуск фронтенда

1. Перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите разработческий сервер Next.js:
```bash
npm run dev
```

Фронтенд будет доступен по адресу http://localhost:3000

### Использование Docker

Для запуска через Docker Compose:

```bash
docker-compose up --build
```

Это запустит и PostgreSQL и приложение в контейнерах Docker.

## Схема данных

### User (Пользователь)
- id: Int (первичный ключ)
- username: String (уникальный)
- password: String (хешированный)
- todos: Todo[] (отношение один-ко-многим)

### Todo (Задача)
- id: Int (первичный ключ)
- task: String
- completed: Boolean (по умолчанию false)
- userId: Int (внешний ключ)
- user: User (отношение многие-к-одному)

### Appeal (Обращение)
- id: Int (первичный ключ)
- subject: String (тема обращения)
- description: String (описание проблемы)
- status: String (по умолчанию "new", возможные значения: "new", "in_progress", "completed", "cancelled")
- solution: String? (решение проблемы, опционально)
- cancelReason: String? (причина отмены, опционально)
- createdAt: DateTime (дата создания)
- updatedAt: DateTime (дата обновления)
