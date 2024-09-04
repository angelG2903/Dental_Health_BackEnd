const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Login = require('./Login');

const Doctor = sequelize.define('Doctor', {
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
        }
    },
    degree: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    professionalLicense: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialtyLicense: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clinicName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clinicLogo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    clinicAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorizationFile: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

Login.hasOne(Doctor, { foreignKey: 'loginId' });
Doctor.belongsTo(Login, { foreignKey: 'loginId' });


module.exports = Doctor;