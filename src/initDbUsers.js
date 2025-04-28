import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Скрипт для инициализации базовых пользователей в системе
 * Создает суперпользователя, если его еще нет в системе
 */
async function initUsers() {
  try {
    console.log('Инициализация базовых пользователей...')
    
    // Проверка наличия суперпользователя
    const existingSuperuser = await prisma.user.findFirst({
      where: {
        role: 'superuser'
      }
    })
    
    // Если суперпользователя нет, создаем его
    if (!existingSuperuser) {
      const hashedPassword = bcrypt.hashSync('007dd007dd', 8)
      
      const superuser = await prisma.user.create({
        data: {
          username: 'dmitriiming',
          password: hashedPassword,
          role: 'superuser'
        }
      })
      
      console.log('Создан суперпользователь:', superuser.username)
      
      // Добавляем задачи для суперпользователя
      await prisma.todo.create({
        data: {
          task: 'Проверить новые обращения',
          userId: superuser.id
        }
      })
      
      await prisma.todo.create({
        data: {
          task: 'Создать учетные записи для администраторов',
          userId: superuser.id
        }
      })
    } else {
      console.log('Суперпользователь уже существует:', existingSuperuser.username)
    }
    
    // Проверка наличия обычного администратора
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    })
    
    // Если админа нет, создаем его
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync('admin123', 8)
      
      const admin = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          role: 'admin'
        }
      })
      
      console.log('Создан администратор:', admin.username)
      
      // Добавляем задачу для администратора
      await prisma.todo.create({
        data: {
          task: 'Обработать новые обращения',
          userId: admin.id
        }
      })
    } else {
      console.log('Администратор уже существует:', existingAdmin.username)
    }
    
    console.log('Инициализация базовых пользователей завершена')
  } catch (error) {
    console.error('Ошибка при инициализации пользователей:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export default initUsers