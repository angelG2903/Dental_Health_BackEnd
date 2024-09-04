const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Login = require('./Login');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    loginId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Login,
            key: 'id'
        },
    },
    maritalStatus: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    occupation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
});

Login.hasOne(Patient, { foreignKey: 'loginId' });
Patient.belongsTo(Login, { foreignKey: 'loginId' });

module.exports = Patient;
