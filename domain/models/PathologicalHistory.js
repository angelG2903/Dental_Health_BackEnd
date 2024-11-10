const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const MedicalHistory = require('./MedicalHistory');

const PathologicalHistory = sequelize.define('PathologicalHistory', {
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

MedicalHistory.hasMany(PathologicalHistory, { foreignKey: 'medicalId', onDelete: 'CASCADE' });
PathologicalHistory.belongsTo(MedicalHistory, { foreignKey: 'medicalId', onDelete: 'CASCADE' });

module.exports = PathologicalHistory;