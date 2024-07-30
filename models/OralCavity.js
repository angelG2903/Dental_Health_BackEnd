const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Patient = require('./Patient');

const OralCavity = sequelize.define('OralCavity', {
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
    cavity1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cavity2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cavity3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dolor: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    luxacion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    anquilosis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    crepitacion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    subluxacion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    espasmoMuscular: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

});

Patient.hasMany(OralCavity, { foreignKey: 'patientId' });
OralCavity.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = OralCavity;