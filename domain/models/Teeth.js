const { DataTypes } = require('sequelize');
const { sequelize } = require('../../persistence/config/db');
const DentalExam = require('./DentalExam');

const Teeth = sequelize.define('Teeth', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dentalExamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DentalExam,
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

DentalExam.hasOne(Teeth, { foreignKey: 'dentalExamId', onDelete: 'CASCADE' });
Teeth.belongsTo(DentalExam, { foreignKey: 'dentalExamId', onDelete: 'CASCADE' });

module.exports = Teeth;