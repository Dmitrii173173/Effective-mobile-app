import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно создан, возвращает токен
 *       503:
 *         description: Ошибка сервера
 */
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body

    // Проверка роли - только суперпользователь может создавать админов
    if (role === 'admin' || role === 'superuser') {
        // Проверка токена для авторизации
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ error: 'Требуется авторизация суперпользователя' });
        }

        try {
            // Декодирование токена
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Проверка роли пользователя
            if (decoded.role !== 'superuser') {
                return res.status(403).json({ error: 'Только суперпользователь может создавать пользователей с ролью администратора' });
            }
            
        } catch (err) {
            return res.status(401).json({ error: 'Недействительный токен' });
        }
    }

    // Шифруем пароль
    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        // Создаем пользователя с указанной ролью или по умолчанию 'user'
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: role || 'user'
            }
        })

        // Добавляем первую задачу для пользователя
        await prisma.todo.create({
            data: {
                task: `Привет! Добавьте свою первую задачу!`,
                userId: user.id
            }
        })

        // Создаем токен с информацией о роли
        const token = jwt.sign({ 
            id: user.id, 
            role: user.role,
            username: user.username
        }, process.env.JWT_SECRET, { expiresIn: '24h' })
        
        res.json({ token, role: user.role })
    } catch (err) {
        console.log(err.message)
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Пользователь с таким именем уже существует' })
        }
        res.sendStatus(503)
    }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает токен
 *       401:
 *         description: Неверный пароль
 *       404:
 *         description: Пользователь не найден
 *       503:
 *         description: Ошибка сервера
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        // Поиск пользователя в базе данных
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // Если пользователь не найден
        if (!user) { 
            return res.status(404).send({ message: "User not found" }) 
        }

        // Проверка пароля
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) { 
            return res.status(401).send({ message: "Invalid password" }) 
        }
        
        // Создание JWT токена с ролью пользователя
        const token = jwt.sign({ 
            id: user.id, 
            role: user.role, 
            username: user.username 
        }, process.env.JWT_SECRET, { expiresIn: '24h' })
        
        res.json({ token, role: user.role })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router