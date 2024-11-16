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
    }

});

Patient.hasOne(DentalExam, { foreignKey: 'patientId', onDelete: 'CASCADE' });
DentalExam.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });

module.exports = DentalExam;