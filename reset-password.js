import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Загружаем переменные окружения
dotenv.config()

const prisma = new PrismaClient()

async function resetPassword() {
  const username = 'dmitriiming'
  const newPassword = '007dd007dd'
  
  try {
    console.log(`Сброс пароля для пользователя: ${username}`)
    
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user) {
      console.error('Ошибка: Пользователь не найден')
      return
    }
    
    console.log('Пользователь найден, id:', user.id, 'роль:', user.role)
    
    // Хешируем новый пароль
    const hashedPassword = bcrypt.hashSync(newPassword, 8)
    console.log('Новый хеш пароля:', hashedPassword)
    
    // Обновляем пароль
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })
    
    console.log('Пароль успешно обновлен для пользователя:', updatedUser.username)
  } catch (error) {
    console.error('Произошла ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()