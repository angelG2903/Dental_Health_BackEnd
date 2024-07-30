const { Op } = require('sequelize');
const { CardiovascularSystem } = require('../models');

async function checkAndDeleteEmptyCardiovascular() {
    try {
        // Lógica para encontrar y eliminar registros vacíos
        const emptyRecords = await CardiovascularSystem.findAll({
            where: {
                [Op.and]: [
                    { cardiovascular1: { [Op.or]: [null, ''] } },
                    { cardiovascular2: { [Op.or]: [null, ''] } },
                    { cardiovascular3: { [Op.or]: [null, ''] } },
                    { cardiovascular4: { [Op.or]: [null, ''] } },
                    { cardiovascular5: { [Op.or]: [null, ''] } },
                    { cardiovascular6: { [Op.or]: [null, ''] } },
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

module.exports = checkAndDeleteEmptyCardiovascular;
