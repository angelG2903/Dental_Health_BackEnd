const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Doctor = require('./Doctor');

const Promotion = sequelize.define('Promotion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Doctor,
            key: 'id'
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    promotionalImage: {
        type: DataTypes.STRING,
        allowNull: true,
    }

});

Doctor.hasOne(Promotion, { foreignKey: 'doctorId' });
Promotion.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Promotion;