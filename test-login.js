import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Загружаем переменные окружения
dotenv.config()

const prisma = new PrismaClient()

async function testLogin() {
  const username = 'dmitriiming'
  const password = '007dd007dd'
  
  try {
    console.log('Testing login for user:', username)
    
    // 1. Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user) {
      console.error('Ошибка: Пользователь не найден')
      return
    }
    
    console.log('Пользователь найден, id:', user.id, 'роль:', user.role)
    
    // 2. Проверяем пароль
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    console.log('Проверка пароля:', passwordIsValid ? 'УСПЕШНО' : 'НЕВЕРНЫЙ ПАРОЛЬ')
    
    if (!passwordIsValid) {
      console.log('Сохраненный хеш пароля:', user.password)
      // Создаем новый хеш для сравнения
      const newHash = bcrypt.hashSync(password, 8)
      console.log('Новый хеш того же пароля:', newHash)
      return
    }
    
    // 3. Создаем токен
    const token = jwt.sign({ 
      id: user.id, 
      role: user.role, 
      username: user.username 
    }, process.env.JWT_SECRET, { expiresIn: '24h' })
    
    console.log('Токен успешно создан:', token.substring(0, 20) + '...')
    
    // 4. Пробуем декодировать токен для проверки
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Декодированный токен:', decoded)
    
    console.log('Тест входа УСПЕШНО ПРОЙДЕН')
  } catch (error) {
    console.error('Произошла ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()