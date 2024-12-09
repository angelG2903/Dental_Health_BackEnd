const { Patient, Login, DentalExam, Teeth } = require('../../domain/models');

const validationState = ['sano', 'cariado', 'obturado', 'od_perdido', 'protesis_parcial_r', 'od_reemplazado', 'protesis_fija', 'ext_indicada'];
const validationLifeStage = ['adult', 'child'];

exports.create = async (req, res) => {
    const { id } = req.params;
    const dentalData = req.body; 

    try {

        if (Object.keys(dentalData.dientes).length === 0) {
            return res.status(400).json({ error: 'Invalid or empty data' });
        }

        // Validamos que el paciente exista
        const validationId = await Patient.findOne({ where: { id } });
        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Creamos el expediente dental
        const dentalExam = await DentalExam.create({ patientId: id });

        // Array para almacenar los errores
        const errors = [];
        const createPromises = [];

        // Iteramos sobre los valores del objeto `dentalData`
        for (const diente of dentalData.dientes) {
            const { lifeStage, toothNumber, state } = diente;

            // Validaciones
            if (!Object.values(dentalData.dientes).every(value => !!value)) {
                errors.push({ error: 'lifeStage, toothNumber, and state are required', data: dentalData[diente] });
                continue;
            }

            if (!validationState.includes(state)) {
                console.log(state)
                errors.push({ error: 'Invalid State', data: dentalData[diente] });
                continue;
            }

            if (!validationLifeStage.includes(lifeStage)) {
                errors.push({ error: 'Invalid lifeStage', data: dentalData[diente] });
                continue;
            }

            // Creamos el registro si todas las validaciones pasan
            createPromises.push(
                Teeth.create({ 
                    dentalExamId: dentalExam.id, 
                    lifeStage, 
                    toothNumber, 
                    state 
                }));
        }

        // Ejecutamos todas las promesas de creación de registros
        const createdRecords = await Promise.all(createPromises);

        // Si hubo errores, los devolvemos junto con los registros creados exitosamente
        if (errors.length > 0) {
            console.log(req.body);
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
        console.error('Error en el servidor:', error);
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
            where: { patientId: id },
            include: [
                {
                    model: Patient,
                    include: {
                        model:Login
                    }
                }
                
            
            ]
        });

        res.status(200).json(dentalExams);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.getAllDentalExamsById = async (req, res) => {
    const { id } = req.params;

    try {
        // Validamos que exista el id del DentalExam 
        const validationId = await DentalExam.findOne({ where: { id } });

        if (!validationId) {
            return res.status(404).json({ error: 'DentalExam not found' });
        }

        const dentalExam = await Teeth.findAll({
            where: { dentalExamId: id }
        });

        res.status(200).json(dentalExam);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.updateDentalExam = async (req, res) => {
    const { id } = req.params;
    const dentalData = req.body; // Recibimos el objeto con los datos de los exámenes dentales

    try {

        console.log("Datos recibidos:", JSON.stringify(dentalData, null, 2));
        
        if (Object.keys(dentalData.dientes).length === 0) {
            return res.status(400).json({ error: 'Invalid or empty data' });
        }

        // Validar que el examen dental existe
        const dentalExam = await DentalExam.findOne({ where: { id } });
        if (!dentalExam) {
            return res.status(404).json({ error: 'Dental exam not found' });
        }

        // Array para almacenar los errores
        const errors = [];
        const updatePromises  = [];

        // Iterar sobre los dientes enviados
        for (const diente of dentalData.dientes) {
            const { lifeStage, toothNumber, state } = diente;

            // Validaciones
            if (!lifeStage || !toothNumber || !state) {
                errors.push({ error: 'lifeStage, toothNumber, and state are required', data: diente });
                continue;
            }

            if (!validationState.includes(state)) {
                errors.push({ error: 'Invalid state', data: diente });
                continue;
            }

            if (!validationLifeStage.includes(lifeStage)) {
                errors.push({ error: 'Invalid lifeStage', data: diente });
                continue;
            }

            // Actualizar o crear el diente
            const existingTooth = await Teeth.findOne({
                where: {
                    dentalExamId: dentalExam.id,
                    toothNumber
                }
            });

            if (existingTooth) {
                // Si el diente ya existe, actualizarlo
                updatePromises.push(
                    existingTooth.update({ lifeStage, state })
                );
            } else {
                // Si no existe, crearlo
                updatePromises.push(
                    Teeth.create({
                        dentalExamId: dentalExam.id,
                        lifeStage,
                        toothNumber,
                        state
                    })
                );
            }
        }

        // Ejecutar todas las actualizaciones/creaciones
        const updatedRecords = await Promise.all(updatePromises);

        // Si hubo errores, devolverlos junto con los registros actualizados
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Some records could not be processed',
                updatedRecords,
                errors
            });
        }

        // Si todo salió bien, devolver los registros actualizados
        res.status(200).json({ updatedRecords });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
        console.error('Error en el servidor:', error);
    }
};


exports.deleteDentalExam = async (req, res) => {
    const { id } = req.params;

    try {
        const medical = await DentalExam.findOne({ where: { id } });
        if (!medical) {
            return res.status(404).json({ error: 'Dental Exam not found' });
        }

        await DentalExam.destroy({ where: { id } });
        await Teeth.destroy({ where: { dentalExamId: id  } });

        res.status(200).json({ message: 'Dental Exam deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};
