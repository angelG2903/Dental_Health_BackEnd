require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./persistence/config/db');
const { swaggerUi, specs } = require('./persistence/config/swagger');
const { authRoutes, medicalFormRoutes, promotionRoutes, dentalExamRoutes, appointmentRoutes, messageRoutes, notificationRoutes } = require('./presentation/routes');
const cronJobs = require('./infrastructure/utils/cronJobs');
const cookieParser = require('cookie-parser'); 

const app = express();

// Usar cookie-parser como middleware global
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use('/infrastructure/uploads', express.static(path.join(__dirname, '/infrastructure/uploads')));

connectDB();

// Sincronizar modelos (Solo en desarrollo)

/* const { sequelize } = require('./persistence/config/db');
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
app.use('/api/notification', notificationRoutes);


// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;