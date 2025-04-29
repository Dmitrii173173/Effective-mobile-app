import http from 'http';

// Функция для отправки запроса
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log(`Статус ответа: ${res.statusCode}`);
          if (responseData) {
            try {
              const parsedData = JSON.parse(responseData);
              console.log('Ответ от сервера (JSON):', JSON.stringify(parsedData, null, 2));
            } catch (e) {
              console.log('Ответ от сервера (текст):', responseData.substring(0, 200) + (responseData.length > 200 ? '...' : ''));
            }
          }
          resolve({ statusCode: res.statusCode, data: responseData });
        } catch (e) {
          console.error('Ошибка при обработке ответа:', e);
          reject(e);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Проблема с запросом: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

async function checkServer() {
  console.log('Проверка статуса сервера на порту 5003...');
  
  try {
    // Проверяем маршрут API docs
    console.log('\n1. Проверка маршрута /api-docs (Swagger):');
    const docsOptions = {
      hostname: 'localhost',
      port: 5003,
      path: '/api-docs',
      method: 'GET'
    };
    
    await makeRequest(docsOptions);
    
    // Проверяем корневой маршрут
    console.log('\n2. Проверка корневого маршрута /:');
    const rootOptions = {
      hostname: 'localhost',
      port: 5003,
      path: '/',
      method: 'GET'
    };
    
    await makeRequest(rootOptions);
    
    // Проверяем маршрут простого входа (для проверки обновления сервера)
    console.log('\n3. Проверка маршрута /simple-auth/simple-login:');
    const loginOptions = {
      hostname: 'localhost',
      port: 5003,
      path: '/simple-auth/simple-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength('{"username":"test"}')
      }
    };
    
    const request = http.request(loginOptions, (res) => {
      console.log(`Статус ответа: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log('Ответ от сервера:', chunk);
      });
    });
    
    request.on('error', (error) => {
      console.error(`Ошибка запроса: ${error.message}`);
    });
    
    request.write('{"username":"test"}');
    request.end();
    
    console.log('\nСервер работает! Теперь вы можете открыть:');
    console.log('- Страницу простого входа: http://localhost:5003/simple-login.html');
    console.log('- Документацию API: http://localhost:5003/api-docs');
    console.log('- Фронтенд Next.js: http://localhost:3001');
    
  } catch (error) {
    console.error('Ошибка при проверке сервера:', error);
  }
}

checkServer();