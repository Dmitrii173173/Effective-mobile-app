import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'API для управления задачами с аутентификацией',
    },
    servers: [
      {
        url: 'http://localhost:5003',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // пути к файлам с аннотациями
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };