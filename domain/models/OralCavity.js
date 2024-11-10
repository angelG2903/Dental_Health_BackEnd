const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const MedicalHistory = require('./MedicalHistory');

const OralCavity = sequelize.define('OralCavity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    medicalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MedicalHistory,
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

MedicalHistory.hasMany(OralCavity, { foreignKey: 'medicalId', onDelete: 'CASCADE' });
OralCavity.belongsTo(MedicalHistory, { foreignKey: 'medicalId', onDelete: 'CASCADE' });

module.exports = OralCavity;