import http from 'http';

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

async function testSimpleLoginAPI() {
  console.log('Тестирование простого API входа в систему...');
  console.log('Использую порт: 5003');
  
  const loginData = JSON.stringify({
    username: 'dmitriiming',
    password: '007dd007dd'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5003,
    path: '/simple-auth/simple-login',
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

testSimpleLoginAPI();