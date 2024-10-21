const { Op } = require('sequelize');
const { Patient, DentalExam } = require('../../domain/models');

const validationState = ['sano', 'cariado', 'obturado', 'od_perdido', 'protesis_parcial_r', 'od_reemplazado', 'protesis_fija', 'ext_indicada'];
const validationLifeStage = ['adult','child'];

exports.create = async (req, res) => {
    const { id } = req.params;
    const dentalData = req.body; // Recibimos el objeto con los datos de los dientes

    try {
        // Validamos que el paciente exista
        const validationId = await Patient.findOne({ where: { id } });
        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Array para almacenar los errores
        const errors = [];
        const createdRecords = [];

        // Iteramos sobre los datos recibidos
        for (const key in dentalData) {
            if (dentalData.hasOwnProperty(key)) {
                const { lifeStage, toothNumber, state } = dentalData[key];

                // Validaciones
                if (!lifeStage || !toothNumber || !state) {
                    errors.push({ error: 'lifeStage, toothNumber, and state are required', data: dentalData[key] });
                    continue; // Continuamos con el siguiente registro
                }

                if (!validationState.includes(state)) {
                    errors.push({ error: 'Invalid State', data: dentalData[key] });
                    continue;
                }

                if (!validationLifeStage.includes(lifeStage)) {
                    errors.push({ error: 'Invalid lifeStage', data: dentalData[key] });
                    continue;
                }

                // Validamos que no haya un registro duplicado para el mismo diente
                const duplicateTooth = await DentalExam.findOne({
                    where: {
                        patientId: id,
                        toothNumber
                    }
                });

                if (duplicateTooth) {
                    errors.push({ error: 'Tooth number already exists for this patient', data: dentalData[key] });
                    continue;
                }

                // Creamos el registro si todas las validaciones pasan
                const newRecord = await DentalExam.create({ patientId: id, lifeStage, toothNumber, state });
                createdRecords.push(newRecord);
            }
        }

        // Si hubo errores, los devolvemos junto con los registros creados exitosamente
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Some records could not be processed',
                createdRecords,
                errors
            });
        }

        // Si todo salió bien, devolvemos los registros creados
        res.status(201).json({ createdRecords });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.getAllDentalExams = async (req, res) => {
    const { id } = req.params;

    try {
        // Validamos que exista el id del Patient
        const validationId = await Patient.findOne({ where: { id } });

        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const dentalExams = await DentalExam.findAll({
            where: { patientId: id }
        });

        res.status(200).json(dentalExams);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.updateDentalExam = async (req, res) => {
    const { id } = req.params;
    const dentalData = req.body; // Recibimos el objeto con los datos de los exámenes dentales

    try {
        // Validamos que el paciente exista
        const validationId = await Patient.findOne({ where: { id } });
        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Array para almacenar los errores
        const errors = [];
        const updatedRecords = [];

        // Iteramos sobre los datos recibidos
        for (const key in dentalData) {
            if (dentalData.hasOwnProperty(key)) {
                const { examId, lifeStage, toothNumber, state } = dentalData[key];

                // Validamos que exista el registro del examen dental
                const dentalExam = await DentalExam.findOne({
                    where: {
                        patientId: id,
                        id: examId
                    }
                });

                if (!dentalExam) {
                    errors.push({ error: 'Dental exam not found', data: dentalData[key] });
                    continue; // Saltamos al siguiente registro
                }

                // Validaciones de lifeStage y state
                if (lifeStage && !validationLifeStage.includes(lifeStage)) {
                    errors.push({ error: 'Invalid lifeStage', data: dentalData[key] });
                    continue;
                }

                if (state && !validationState.includes(state)) {
                    errors.push({ error: 'Invalid State', data: dentalData[key] });
                    continue;
                }

                // Validamos que no se duplique el toothNumber para el mismo patientId 
                // YA NO IMPORTA ESTA VALIDACION
                /* if (toothNumber) {
                    const duplicateTooth = await DentalExam.findOne({
                        where: {
                            patientId: id,
                            toothNumber,
                            id: { [Op.ne]: examId } // Excluye el registro actual
                        }
                    });

                    if (duplicateTooth) {
                        errors.push({ error: 'Tooth number already exists for this patient', data: dentalData[key] });
                        continue;
                    }
                } */

                // Actualizamos el registro si todas las validaciones pasan
                await DentalExam.update(
                    { lifeStage, toothNumber, state },
                    { where: { id: examId, patientId: id } }
                );

                updatedRecords.push({ examId, lifeStage, toothNumber, state });
            }
        }

        // Si hubo errores, los devolvemos junto con los registros actualizados exitosamente
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Some records could not be processed',
                updatedRecords,
                errors
            });
        }

        // Si todo salió bien, devolvemos los registros actualizados
        res.status(200).json({ message: 'Dental exams updated successfully', updatedRecords });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.deleteDentalExam = async (req, res) => {
    const { id, examId } = req.params;

    try {
        // Validamos que exista el id del Patient
        const validationId = await Patient.findOne({ where: { id } });

        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const dentalExam = await DentalExam.findOne({
            where: {
                patientId: id,
                id: examId
            }
        });

        if (!dentalExam) {
            return res.status(404).json({ error: 'Dental exam not found' });
        }

        await DentalExam.destroy({
            where: {
                id: examId,
                patientId: id
            }
        });

        res.status(200).json({ message: 'Dental exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};
