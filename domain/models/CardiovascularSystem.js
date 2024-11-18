const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const MedicalHistory = require('./MedicalHistory');

const CardiovascularSystem = sequelize.define('CardiovascularSystem', {
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

MedicalHistory.hasMany(CardiovascularSystem, { foreignKey: 'medicalId', onDelete: 'CASCADE' });
CardiovascularSystem.belongsTo(MedicalHistory, { foreignKey: 'medicalId', onDelete: 'CASCADE' });

module.exports = CardiovascularSystem;