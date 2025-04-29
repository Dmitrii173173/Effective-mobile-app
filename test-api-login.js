import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Читаем .env файл вручную
const envPath = resolve(__dirname, '.env')
let PORT = '5003' // значение по умолчанию

try {
  const envContent = readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  for (const line of envLines) {
    if (line.startsWith('PORT=')) {
      PORT = line.substring('PORT='.length).trim()
      break
    }
  }
} catch (err) {
  console.error('Ошибка при чтении .env файла:', err.message)
  console.log('Используем порт по умолчанию:', PORT)
}

// Функция для отправки запроса
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`Статус ответа: ${res.statusCode}`);
        console.log(`Заголовки ответа: ${JSON.stringify(res.headers)}`);
        
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsedData });
        } catch (e) {
          console.log('Ответ не является JSON:', responseData);
          resolve({ statusCode: res.statusCode, headers: res.headers, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Проблема с запросом: ${error.message}`);
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function testLoginAPI() {
  console.log('Тестирование API входа в систему...');
  console.log(`Использую порт: ${PORT}`);
  
  const loginData = JSON.stringify({
    username: 'dmitriiming',
    password: '007dd007dd'
  });
  
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  console.log('Отправка запроса на вход с данными:');
  console.log(loginData);
  
  try {
    const response = await makeRequest(options, loginData);
    
    if (response.statusCode === 200) {
      console.log('Запрос на вход успешен!');
      console.log('Полученный токен:', response.data.token);
      console.log('Роль пользователя:', response.data.role);
    } else {
      console.log('Запрос на вход не удался, код ошибки:', response.statusCode);
      console.log('Сообщение ошибки:', response.data);
    }
  } catch (error) {
    console.error('Произошла ошибка при отправке запроса:', error);
  }
}

testLoginAPI();