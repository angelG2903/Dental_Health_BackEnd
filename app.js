require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./persistence/config/db');
const { swaggerUi, specs } = require('./persistence/config/swagger');
const { authRoutes, medicalFormRoutes, promotionRoutes, dentalExamRoutes, appointmentRoutes, messageRoutes } = require('./presentation/routes');
const cronJobs = require('./infrastructure/utils/cronJobs');

const app = express();

app.use(cors());

app.use(express.json());
app.use('/infrastructure/uploads', express.static('uploads'));

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
app.use('/api/appointment', appointmentRoutes);
app.use('/api/message', messageRoutes);


// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;