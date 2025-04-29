import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Читаем .env файл вручную
const envPath = resolve(__dirname, '.env')
let JWT_SECRET = 'your_secret_key_here' // Значение по умолчанию из .env

try {
  const envContent = readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  for (const line of envLines) {
    if (line.startsWith('JWT_SECRET=')) {
      JWT_SECRET = line.substring('JWT_SECRET='.length).replace(/"/g, '').trim()
      break
    }
  }
} catch (err) {
  console.error('Ошибка при чтении .env файла:', err.message)
  console.log('Используем значение JWT_SECRET по умолчанию:', JWT_SECRET)
}

const prisma = new PrismaClient()

async function testLogin() {
  const username = 'dmitriiming'
  const password = '007dd007dd'
  
  try {
    console.log('Testing login for user:', username)
    console.log('Using JWT_SECRET:', JWT_SECRET)
    
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
    }, JWT_SECRET, { expiresIn: '24h' })
    
    console.log('Токен успешно создан:', token.substring(0, 20) + '...')
    
    // 4. Пробуем декодировать токен для проверки
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Декодированный токен:', decoded)
    
    console.log('Тест входа УСПЕШНО ПРОЙДЕН')
  } catch (error) {
    console.error('Произошла ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()