const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Patient = require('./Patient');

const MedicalHistory = sequelize.define('MedicalHistory', {
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
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tA: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fC: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fR: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    t: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    history1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history4: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history5: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history6: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history7: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    history8: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

Patient.hasMany(MedicalHistory, { foreignKey: 'patientId' });
MedicalHistory.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = MedicalHistory;