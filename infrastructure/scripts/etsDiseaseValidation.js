const { Op } = require('sequelize');
const { EtsDisease } = require('../../domain/models');

async function checkAndDeleteEmptyEtsDisease() {
    try {
        // Lógica para encontrar y eliminar registros vacíos
        const emptyRecords = await EtsDisease.findAll({
            where: {
                [Op.and]: [
                    { disease1: { [Op.or]: [null, ''] } },
                    { disease2: { [Op.or]: [null, ''] } },
                    { disease3: { [Op.or]: [null, ''] } },
                    { disease4: { [Op.or]: [null, ''] } },
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

module.exports = checkAndDeleteEmptyEtsDisease;
