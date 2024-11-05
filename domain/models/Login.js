const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');

const Login = sequelize.define('Login', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
       type: DataTypes.STRING,
       allowNull: false, 
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('femenino', 'masculino'),
        allowNull: false, 
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        validate: {len: [10, 10]},
        allowNull: false,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('doctor', 'patient'),
        allowNull: false,
    },
});

module.exports = Login;