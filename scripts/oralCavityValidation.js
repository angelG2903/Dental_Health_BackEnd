const { Op } = require('sequelize');
const { OralCavity } = require('../models');

async function checkAndDeleteEmptyOralCavity() {
    try {
        // Lógica para encontrar y eliminar registros vacíos
        const emptyRecords = await OralCavity.findAll({
            where: {
                [Op.and]: [
                    { cavity1: { [Op.or]: [null, ''] } },
                    { cavity2: { [Op.or]: [null, ''] } },
                    { cavity3: { [Op.or]: [null, ''] } },
                    { dolor: { [Op.or]: [null, ''] } },
                    { luxacion: { [Op.or]: [null, ''] } },
                    { anquilosis: { [Op.or]: [null, ''] } },
                    { crepitacion: { [Op.or]: [null, ''] } },
                    { subluxacion: { [Op.or]: [null, ''] } },
                    { espasmoMuscular: { [Op.or]: [null, ''] } },
                    // Agrega más condiciones para otros campos relevantes
                ]
            }
        });

        if (emptyRecords.length > 0) {
            console.log(`Deleting ${emptyRecords.length} empty records...`);
            for (let record of emptyRecords) {
                await record.destroy();
                console.log(`Record ID: ${record.id} deleted successfully.`);
            }
        } else {
            console.log('No empty records found.');
        }
    } catch (error) {
        console.error('Error checking and deleting empty records:', error);
    }
};

module.exports = checkAndDeleteEmptyOralCavity;
