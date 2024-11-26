const { Op } = require('sequelize');
const { PathologicalHistory } = require('../../domain/models');

async function checkAndDeleteEmptyPathologicalHistory() {
    try {
        // Lógica para encontrar y eliminar registros vacíos
        const emptyRecords = await PathologicalHistory.findAll({
            where: {
                [Op.and]: [
                    { colitis: { [Op.or]: [null, '', 0] } },
                    { gastritis: { [Op.or]: [null, '', 0] } },
                    { gastroenteritis: { [Op.or]: [null, '', 0] } },
                    { asma: { [Op.or]: [null, '', 0] } },
                    { bronquitis: { [Op.or]: [null, '', 0] } },
                    { neumonia: { [Op.or]: [null, '', 0] } },
                    { tuberculosis: { [Op.or]: [null, '', 0] } },
                    { farinoamigdalitis: { [Op.or]: [null, '', 0] } },
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
