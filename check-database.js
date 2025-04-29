import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Читаем .env файл вручную
const envPath = resolve(__dirname, '.env')
let DATABASE_URL = ''

try {
  console.log('Reading .env file from:', envPath)
  const envContent = readFileSync(envPath, 'utf8')
  console.log('Content of .env file:', envContent)
  
  const envLines = envContent.split('\n')
  for (const line of envLines) {
    if (line.startsWith('DATABASE_URL=')) {
      DATABASE_URL = line.substring('DATABASE_URL='.length).replace(/"/g, '').trim()
      break
    }
  }
  
  console.log('Detected DATABASE_URL:', DATABASE_URL)
} catch (err) {
  console.error('Ошибка при чтении .env файла:', err.message)
}

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('Проверка соединения с базой данных...')
    
    // Проверяем соединение, запрашивая всех пользователей
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        // Не выбираем пароль для безопасности
      }
    })
    
    console.log('Соединение с базой данных успешно установлено')
    console.log(`Найдено ${users.length} пользователей:`)
    
    // Выводим информацию о каждом пользователе
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Имя: ${user.username}, Роль: ${user.role}`)
    })
    
    // Проверяем наличие пользователя dmitriiming
    const dmitriiming = users.find(user => user.username === 'dmitriiming')
    if (dmitriiming) {
      console.log('\nПользователь dmitriiming найден в базе данных:')
      console.log(`ID: ${dmitriiming.id}, Роль: ${dmitriiming.role}`)
      
      // Получаем хеш пароля
      const userWithPassword = await prisma.user.findUnique({
        where: { username: 'dmitriiming' },
        select: { password: true }
      })
      
      console.log(`Хеш пароля: ${userWithPassword.password}`)
    } else {
      console.log('\nПользователь dmitriiming НЕ найден в базе данных!')
    }
    
  } catch (error) {
    console.error('Ошибка при проверке базы данных:', error)
    console.error('Подробная информация об ошибке:', JSON.stringify(error, null, 2))
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()