const { Op } = require('sequelize');
const { Patient, DentalExam } = require('../../domain/models');

const validationState = ['sano', 'cariado', 'obturado', 'od_perdido', 'protesis_parcial_r', 'od_reemplazado', 'protesis_fija', 'ext_indicada'];
const validationLifeStage = ['adult','child'];

exports.create = async (req, res) => {

    const { id } = req.params;

    const { lifeStage, toothNumber, state } = req.body;

    try {
        
        if (!lifeStage || !toothNumber || !state) {
            return res.status(400).json({ error: 'lifeStage, toothNumber and state are required' })
        }

        if (!validationState.includes(state)) {
            return res.status(400).json({ error: 'Invalid State' });
        }

        if (!validationLifeStage.includes(lifeStage)) {
            return res.status(400).json({ error: 'Invalid lifeStage' });
        }

        // Validamos que exista el id del Patient
        const validationId = await Patient.findOne({ where: { id } });

        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // no permite que se duplique un registro con el mismo numero de diente
        const duplicateTooth = await DentalExam.findOne({
            where: {
                patientId: id,
                toothNumber
            }
        });

        if (duplicateTooth) {
            return res.status(400).json({ error: 'Tooth number already exists for this patient' });
        }

        await DentalExam.create({ patientId: id, lifeStage, toothNumber, state });

        res.status(201).json({ patientId: id, lifeStage, toothNumber, state });

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
    const { id, examId } = req.params;
    const { lifeStage, toothNumber, state } = req.body;

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

        if (lifeStage && !validationLifeStage.includes(lifeStage)) {
            return res.status(400).json({ error: 'Invalid lifeStage' });
        }

        if (state && !validationState.includes(state)) {
            return res.status(400).json({ error: 'Invalid State' });
        }

        // Validamos que no se duplique el toothNumber para el mismo patientId
        if (toothNumber) {
            const duplicateTooth = await DentalExam.findOne({
                where: {
                    patientId: id,
                    toothNumber,
                    id: { [Op.ne]: examId } // Excluye el registro actual
                }
            });

            if (duplicateTooth) {
                return res.status(400).json({ error: 'Tooth number already exists for this patient' });
            }
        }

        // Actualizamos el registro
        await DentalExam.update(
            { lifeStage, toothNumber, state },
            { where: { id: examId, patientId: id } }
        );

        res.status(200).json({ message: 'Dental exam updated successfully' });
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
