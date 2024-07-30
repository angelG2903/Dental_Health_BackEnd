const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Patient = require('./Patient');

const PathologicalHistory = sequelize.define('PathologicalHistory', {
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
    colitis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    gastritis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    gastroenteritis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    asma: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    bronquitis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    neumonia: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    tuberculosis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    farinoamigdalitis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    pathological1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pathological2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pathological3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pathological4: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pathological5: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pathological6: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pathological7: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

Patient.hasMany(PathologicalHistory, { foreignKey: 'patientId' });
PathologicalHistory.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = PathologicalHistory;