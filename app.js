require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());

connectDB();

// Sincronizar modelos (Solo en desarrollo)

/* const { sequelize } = require('./config/db');
sequelize.sync({ alter: true }); */

// Rutas
app.use('/api/auth', authRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;