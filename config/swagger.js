// configuration of the swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dental Health API',
      version: '1.0.0',
      description: 'API documentation for the Dental Health project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: [
    './routes/swaggerRoutes/promotion/*.js',
    './routes/swaggerRoutes/auth/*.js',
    './routes/swaggerRoutes/medicalForm/*.js'
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
