import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

// Путь к файлу server.js
const serverFilePath = path.join('D:', 'project', 'Effective-mobile-app', 'src', 'server.js');

try {
  // Читаем содержимое файла server.js
  let serverContent = readFileSync(serverFilePath, 'utf8');
  
  // Проверяем, нужно ли добавить импорт simpleAuthRoutes
  if (!serverContent.includes('simpleAuthRoutes')) {
    // Находим импорт authRoutes
    const authRoutesImport = "import authRoutes from './routes/authRoutes.js'";
    
    // Добавляем импорт simpleAuthRoutes после authRoutes
    serverContent = serverContent.replace(
      authRoutesImport,
      `${authRoutesImport}\nimport simpleAuthRoutes from './routes/simpleAuthRoutes.js'`
    );
    
    // Находим строку для добавления маршрута auth
    const authRoutesLine = "app.use('/auth', authRoutes)";
    
    // Добавляем маршрут simpleAuth после auth
    serverContent = serverContent.replace(
      authRoutesLine,
      `${authRoutesLine}\napp.use('/simple-auth', simpleAuthRoutes)`
    );
    
    // Записываем обновленное содержимое обратно в файл
    writeFileSync(serverFilePath, serverContent, 'utf8');
    
    console.log('Файл server.js успешно обновлен!');
    console.log('Добавлен маршрут /simple-auth для упрощенной аутентификации.');
  } else {
    console.log('Маршрут /simple-auth уже добавлен в server.js.');
  }
} catch (error) {
  console.error('Ошибка при обновлении server.js:', error);
}