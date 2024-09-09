const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Patient = require('./Patient');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Patient,
            key: 'id'
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'aceptada', 'cancelada'),
        allowNull: true,
        defaultValue: 'pendiente',
    }
});

Patient.hasMany(Appointment, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });

module.exports = Appointment;