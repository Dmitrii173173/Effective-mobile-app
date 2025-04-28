import express from 'express'
import prisma from '../prismaClient.js'
import { superuserMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получение списка всех пользователей (только для суперпользователя)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 */
router.get('/', superuserMiddleware, async (req, res) => {
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

export default router