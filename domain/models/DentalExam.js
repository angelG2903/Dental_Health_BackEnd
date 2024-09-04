const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const Patient = require('./Patient');

const DentalExam = sequelize.define('DentalExam', {
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
    lifeStage: {
        type: DataTypes.ENUM('adult','child'),
        allowNull: false,
    },
    toothNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    }

});

Patient.hasOne(DentalExam, { foreignKey: 'patientId' });
DentalExam.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = DentalExam;