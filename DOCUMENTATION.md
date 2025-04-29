# Effective Mobile App - Документация проекта

## Общее описание проекта

Effective Mobile App - это веб-приложение для управления задачами и обращениями пользователей. Приложение построено на основе современного стека технологий, включая Node.js, Express, React (Next.js), Prisma и PostgreSQL. Приложение предоставляет функциональность для управления задачами и обработки обращений с разными уровнями доступа для пользователей в зависимости от их роли.

## Структура проекта

Проект имеет следующую структуру:

```
Effective-mobile-app/
├── .env                  # Файл конфигурации окружения
├── .git/                 # Git репозиторий
├── .gitattributes        # Атрибуты Git
├── .gitignore            # Игнорируемые файлы Git
├── .vscode/              # Настройки VS Code
├── docker-compose.yaml   # Конфигурация Docker Compose
├── Dockerfile            # Dockerfile для сборки контейнера
├── frontend/             # Код фронтенд-приложения (Next.js)
│   ├── src/              # Исходный код фронтенда
│   │   ├── app/          # Страницы приложения Next.js
│   │   ├── components/   # React компоненты
│   │   └── lib/          # Вспомогательные библиотеки
├── node_modules/         # Зависимости Node.js
├── package-lock.json     # Lock-файл пакетов npm
├── package.json          # Описание пакета и зависимости
├── prisma/               # Настройки и модели Prisma ORM
│   ├── migrations/       # Миграции базы данных
│   └── schema.prisma     # Схема базы данных
├── public/               # Статические файлы
├── README.md             # Основная документация проекта
├── src/                  # Исходный код бэкенда
│   ├── db.js             # Настройка подключения к БД
│   ├── initDbUsers.js    # Инициализация базовых пользователей
│   ├── middleware/       # Middleware для Express
│   ├── prismaClient.js   # Клиент Prisma
│   ├── routes/           # Маршруты API
│   ├── server.js         # Главный файл сервера
│   └── swagger.js        # Настройка Swagger для документации API
└── todo-app.rest         # Файл с примерами REST-запросов
```

## База данных

Проект использует PostgreSQL в качестве СУБД и Prisma ORM для взаимодействия с базой данных. Схема базы данных определена в файле `prisma/schema.prisma` и включает следующие модели:

### User

Модель пользователя системы:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String
  role      String    @default("user") // "user", "admin", "superuser"
  todos     Todo[]
}
```

### Todo

Модель задачи:

```prisma
model Todo {
  id        Int       @id @default(autoincrement())
  task      String
  completed Boolean   @default(false)
  userId    Int   
  user      User      @relation(fields: [userId], references: [id])
}
```

### Appeal

Модель обращения пользователя:

```prisma
model Appeal {
  id          Int       @id @default(autoincrement())
  subject     String
  description String
  status      String    @default("new") // Возможные значения: "new", "in_progress", "completed", "cancelled"
  solution    String?
  cancelReason String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Роли пользователей

В системе предусмотрены следующие роли пользователей:

1. **user** - обычный пользователь, имеет доступ к своим задачам и может создавать обращения
2. **admin** - администратор, имеет дополнительные права на управление обращениями
3. **superuser** - суперпользователь, имеет полные права в системе, включая управление пользователями и массовые операции с обращениями

## API Endpoints

### Аутентификация (`/auth`)

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| POST | /auth/register | Регистрация нового пользователя | Общедоступный (роли admin/superuser только через суперпользователя) |
| POST | /auth/login | Вход в систему | Общедоступный |

### Задачи (`/todos`)

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| GET | /todos | Получение всех задач пользователя | Авторизованный пользователь |
| POST | /todos | Создание новой задачи | Авторизованный пользователь |
| PUT | /todos/:id | Обновление задачи | Авторизованный пользователь (только свои задачи) |
| DELETE | /todos/:id | Удаление задачи | Авторизованный пользователь (только свои задачи) |

### Обращения (`/appeals`)

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| POST | /appeals | Создание нового обращения | Общедоступный |
| GET | /appeals | Получение списка обращений с фильтрацией по дате | Общедоступный |
| PATCH | /appeals/:id/process | Взятие обращения в обработку | Общедоступный |
| PATCH | /appeals/:id/complete | Завершение обработки обращения | Общедоступный |
| PATCH | /appeals/:id/cancel | Отмена обращения | Только admin/superuser |
| PATCH | /appeals/cancel-all-in-progress | Отмена всех обращений в обработке | Только superuser |

### Пользователи (`/users`)

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| GET | /users | Получение списка пользователей | Только superuser |

## Маршрутизация фронтенда (страницы)

Фронтенд приложения построен на основе Next.js и имеет следующие основные страницы:

| Путь | Описание |
|------|----------|
| / | Главная страница (лендинг) |
| /login | Страница входа в систему |
| /register | Страница регистрации |
| /dashboard | Личный кабинет пользователя с задачами |
| /appeals | Страница для работы с обращениями |

## Middleware

В приложении используются следующие middleware для аутентификации и авторизации:

1. **authMiddleware** - проверяет наличие действительного JWT-токена для защищенных маршрутов
2. **adminMiddleware** - проверяет наличие прав администратора (роли admin или superuser)
3. **superuserMiddleware** - проверяет наличие прав суперпользователя (роли superuser)

## Документация API

API задокументировано с использованием Swagger. Документация доступна по адресу `/api-docs` при запуске сервера.

## Запуск проекта

1. Клонировать репозиторий
2. Настроить файл .env с необходимыми переменными окружения (особенно DATABASE_URL и JWT_SECRET)
3. Установить зависимости: `npm install`
4. Выполнить миграции базы данных: `npx prisma migrate dev`
5. Запустить сервер: `npm start`

## Docker

Проект может быть запущен в Docker контейнере с использованием Docker Compose:

```bash
docker-compose up -d
```

Это запустит как сервер API, так и базу данных PostgreSQL в контейнерах.

## Технологии

- **Бэкенд**: Node.js, Express.js, Prisma ORM
- **Фронтенд**: React, Next.js, Tailwind CSS
- **База данных**: PostgreSQL
- **Аутентификация**: JWT
- **Документация API**: Swagger
- **Контейнеризация**: Docker, Docker Compose
