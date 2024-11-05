const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Patient = require('./Patient');
const Appointment = require('./Appointment');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Patient,
            key: 'id'
        },
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Appointment,
            key: 'id'
        },
    }

});

Patient.hasMany(Notification, {foreignKey: 'patientId', onDelete: 'CASCADE'});
Notification.belongsTo(Patient, {foreignKey: 'patientId', onDelete: 'CASCADE'});

Appointment.hasMany(Notification, {foreignKey: 'appointmentId', onDelete: 'CASCADE'});
Notification.belongsTo(Appointment, {foreignKey: 'appointmentId', onDelete: 'CASCADE'});



module.exports = Notification;