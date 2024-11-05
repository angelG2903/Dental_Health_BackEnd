const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Patient = require('./Patient');

const CardiovascularSystem = sequelize.define('CardiovascularSystem', {
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
    cardiovascular1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cardiovascular2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cardiovascular3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cardiovascular4: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cardiovascular5: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cardiovascular6: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

Patient.hasMany(CardiovascularSystem, { foreignKey: 'patientId', onDelete: 'CASCADE' });
CardiovascularSystem.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });

module.exports = CardiovascularSystem;