const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Patient = require('./Patient');

const EtsDisease = sequelize.define('EtsDisease', {
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

Patient.hasMany(EtsDisease, { foreignKey: 'patientId', onDelete: 'CASCADE' });
EtsDisease.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });

module.exports = EtsDisease;