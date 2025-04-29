import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSuperuser() {
  const username = 'dmitriiming'
  const password = '007dd007dd'
  const role = 'superuser'
  
  try {
    console.log(`Создание/обновление суперпользователя: ${username}`)
    
    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    
    const hashedPassword = bcrypt.hashSync(password, 8)
    console.log('Сгенерирован хеш пароля:', hashedPassword)
    
    let user
    
    if (existingUser) {
      console.log('Пользователь существует, обновляем...')
      
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role
        }
      })
      
      console.log('Пользователь успешно обновлен:', user.username, 'Роль:', user.role)
    } else {
      console.log('Создаем нового пользователя...')
      
      user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role
        }
      })
      
      console.log('Пользователь успешно создан:', user.username, 'Роль:', user.role)
      
      // Добавляем начальные задачи для пользователя
      await prisma.todo.create({
        data: {
          task: 'Проверить новые обращения',
          userId: user.id
        }
      })
      
      await prisma.todo.create({
        data: {
          task: 'Создать учетные записи для администраторов',
          userId: user.id
        }
      })
      
      console.log('Начальные задачи добавлены')
    }
    
    console.log('Операция успешно завершена')
  } catch (error) {
    console.error('Произошла ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperuser()