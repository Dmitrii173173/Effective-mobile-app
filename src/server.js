import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import appealsRoutes from './routes/appealsRoutes.js'
import simpleAuthRoutes from './routes/simpleAuthRoutes.js'
import { authMiddleware, superuserMiddleware } from './middleware/authMiddleware.js'
import { swaggerUi, specs } from './swagger.js'
import initUsers from './initDbUsers.js'
import prisma from './prismaClient.js'

const app = express()
const PORT = process.env.PORT || 5003

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)

// Middleware
app.use(express.json())
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets / file. Any requests for the css files will be resolved to the public directory.
app.use(express.static(path.join(__dirname, '../public')))

// Добавляем Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Serving up the HTML file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

// Логирование запросов для отладки
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/auth', authRoutes)
app.use('/simple-auth', simpleAuthRoutes) // Добавленный маршрут для простой аутентификации
app.use('/todos', authMiddleware, todoRoutes)
app.use('/appeals', appealsRoutes)

// Обработка ошибок 404 для API маршрутов
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Маршрут для получения пользователей (только для суперпользователя)
app.get('/users', superuserMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true
            }
        })
        
        res.json(users)
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error)
        res.status(500).json({ error: 'Ошибка сервера при получении списка пользователей' })
    }
})

app.listen(PORT, async () => {
    console.log(`Server has started on port: ${PORT}`)
    console.log(`Swagger UI доступен по адресу: http://localhost:${PORT}/api-docs`)
    console.log(`Простая страница входа: http://localhost:${PORT}/simple-login.html`)
    
    // Инициализация базовых пользователей при запуске сервера
    try {
        await initUsers()
    } catch (error) {
        console.error('Error initializing users:', error)
    }
})