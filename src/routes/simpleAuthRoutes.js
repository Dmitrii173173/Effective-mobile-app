import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

// Упрощенный маршрут для входа, с детальным логированием
router.post('/simple-login', async (req, res) => {
    console.log('Получен запрос на вход:', req.body)
    const { username, password } = req.body

    if (!username || !password) {
        console.log('Ошибка: отсутствует логин или пароль')
        return res.status(400).json({ 
            error: 'Необходимо указать имя пользователя и пароль' 
        })
    }

    try {
        console.log(`Ищем пользователя: ${username}`)
        
        // Проверяем, существует ли пользователь
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            console.log(`Пользователь ${username} не найден`)
            return res.status(404).json({ 
                error: 'Пользователь не найден',
                details: 'Возможно, пользователь не существует или вы ввели неправильное имя'
            })
        }

        console.log(`Пользователь найден: ${user.username}, роль: ${user.role}`)
        
        // Проверка пароля с детальным логированием
        console.log('Проверка пароля...')
        console.log('Сохраненный хеш пароля:', user.password)
        
        // Простой вход для администратора
        if (user.role === 'superuser' && password === '007dd007dd') {
            console.log('Успешный вход суперпользователя через прямое совпадение пароля')
            
            const token = jwt.sign({ 
                id: user.id, 
                role: user.role, 
                username: user.username 
            }, process.env.JWT_SECRET || 'your_secret_key_here', { expiresIn: '24h' })
            
            return res.json({ 
                success: true,
                message: 'Вход выполнен успешно (суперпользователь)',
                token,
                role: user.role,
                userId: user.id
            })
        }
        
        // Стандартная проверка пароля
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        console.log('Результат проверки пароля:', passwordIsValid ? 'УСПЕШНО' : 'НЕВЕРНЫЙ ПАРОЛЬ')
        
        if (!passwordIsValid) {
            console.log('Ошибка: неверный пароль')
            return res.status(401).json({ 
                error: 'Неверный пароль',
                details: 'Пожалуйста, проверьте правильность введенного пароля'
            })
        }
        
        // Успешный вход
        console.log('Успешный вход, создаем токен')
        
        // Создание JWT токена
        const token = jwt.sign({ 
            id: user.id, 
            role: user.role, 
            username: user.username 
        }, process.env.JWT_SECRET || 'your_secret_key_here', { expiresIn: '24h' })
        
        console.log('Токен создан успешно')
        
        res.json({ 
            success: true,
            message: 'Вход выполнен успешно',
            token,
            role: user.role,
            userId: user.id
        })
    } catch (err) {
        console.error('Ошибка при входе:', err)
        res.status(500).json({ 
            error: 'Ошибка сервера при обработке запроса',
            details: err.message
        })
    }
})

export default router