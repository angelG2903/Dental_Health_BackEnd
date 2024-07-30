const { Op } = require('sequelize');
const { PathologicalHistory } = require('../models');

async function checkAndDeleteEmptyPathologicalHistory() {
    try {
        // Lógica para encontrar y eliminar registros vacíos
        const emptyRecords = await PathologicalHistory.findAll({
            where: {
                [Op.and]: [
                    { colitis: { [Op.or]: [null, ''] } },
                    { gastritis: { [Op.or]: [null, ''] } },
                    { gastroenteritis: { [Op.or]: [null, ''] } },
                    { asma: { [Op.or]: [null, ''] } },
                    { bronquitis: { [Op.or]: [null, ''] } },
                    { neumonia: { [Op.or]: [null, ''] } },
                    { tuberculosis: { [Op.or]: [null, ''] } },
                    { farinoamigdalitis: { [Op.or]: [null, ''] } },
                    { pathological1: { [Op.or]: [null, ''] } },
                    { pathological2: { [Op.or]: [null, ''] } },
                    { pathological3: { [Op.or]: [null, ''] } },
                    { pathological4: { [Op.or]: [null, ''] } },
                    { pathological5: { [Op.or]: [null, ''] } },
                    { pathological6: { [Op.or]: [null, ''] } },
                    { pathological7: { [Op.or]: [null, ''] } },
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

module.exports = checkAndDeleteEmptyPathologicalHistory;
