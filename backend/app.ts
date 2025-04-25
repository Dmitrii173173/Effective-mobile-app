import express from 'express';
import { DataSource } from 'typeorm';
import cors from 'cors';
import 'dotenv/config';
import { Ticket } from './entities/ticket.entity';
import { ticketRouter } from './routes/ticket.routes';
import { errorMiddleware } from './middleware/error.middleware';

export async function createApp() {
  const app = express();
  
  // Настройка CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Middleware для парсинга JSON
  app.use(express.json());
  
  // Создание подключения TypeORM
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tickets_db',
    entities: [Ticket],
    synchronize: process.env.NODE_ENV !== 'production', // Осторожно с этим в production
  });
  
  await dataSource.initialize();
  console.log('База данных успешно подключена');
  
  // Базовый маршрут для проверки здоровья API
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API работает' });
  });
  
  // Регистрация маршрутов
  app.use('/api/tickets', ticketRouter(dataSource));
  
  // Middleware для обработки ошибок
  app.use(errorMiddleware);
  
  return app;
}