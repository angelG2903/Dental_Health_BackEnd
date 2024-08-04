require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const { authRoutes, medicalFormRoutes, promotionRoutes, dentalExamRoutes } = require('./routes');
const cronJobs = require('./utils/cronJobs');

const app = express();
app.use(express.json());

connectDB();

// Sincronizar modelos (Solo en desarrollo)

/* const { sequelize } = require('./config/db');
sequelize.sync({ alter: true }); */

// Ruta para Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/medicalForm', medicalFormRoutes);
app.use('/api/promotion', promotionRoutes);
app.use('/api/dentalExam', dentalExamRoutes);


// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;