const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const MedicalHistory = require('./MedicalHistory');

const EtsDisease = sequelize.define('EtsDisease', {
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
    disease1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    disease2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    disease3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    disease4: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

MedicalHistory.hasMany(EtsDisease, { foreignKey: 'medicalId', onDelete: 'CASCADE' });
EtsDisease.belongsTo(MedicalHistory, { foreignKey: 'medicalId', onDelete: 'CASCADE' });

module.exports = EtsDisease;