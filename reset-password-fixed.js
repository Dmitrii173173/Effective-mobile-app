import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Читаем .env файл вручную
const envPath = resolve(__dirname, '.env')

try {
  console.log('Reading .env file from:', envPath)
  const envContent = readFileSync(envPath, 'utf8')
  console.log('Content of .env file:', envContent)
} catch (err) {
  console.error('Ошибка при чтении .env файла:', err.message)
}

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