const { Login, Patient, MedicalHistory, CardiovascularSystem, EtsDisease, PathologicalHistory, OralCavity } = require('../../domain/models');

exports.register = async (req, res) => {

    const { id } = req.params;

    const { 
        weight, size, tA, fC, fR, t, history1, history2, history3, history4, history5, history6, history7, history8,
        cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6,
        disease1, disease2, disease3, disease4,
        colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7,
        cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular
    } = req.body;


    try {

        const valitedId = await Patient.findOne({ where: { id } })
        
        if (!valitedId) {
            return res.status(404).json({ error: 'Patient not found' });
        } 


        const medicalHistoryId = await MedicalHistory.create({ patientId: valitedId.id, weight, size, tA, fC, fR, t, history1, history2, history3, history4, history5, history6, history7, history8 });

        // validar si hay datos en cardiovascular
        const hasCardiovascularData = [cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6].some(value => value !== null && value !== undefined && value !== '');
        if (hasCardiovascularData) {
            await CardiovascularSystem.create({ medicalId: medicalHistoryId.id, cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6 });
        }

        // validar si hay datos en ETS
        const hasEtsDiseaseData = [disease1, disease2, disease3, disease4].some(value => value !== null && value !== undefined && value !== '');
        if (hasEtsDiseaseData) {
            await EtsDisease.create({ medicalId: medicalHistoryId.id, disease1, disease2, disease3, disease4 });
        }

        // validar si hay datos en PathologicalHistory
        const hasPathologicalHistoryData = [colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7].some(value => value !== null && value !== undefined && value !== '');
        if (hasPathologicalHistoryData) {
            await PathologicalHistory.create({  medicalId: medicalHistoryId.id, colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7 });
        }

        // validar si hay datos en OralCavity
        const hasOralCavityData = [cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular].some(value => value !== null && value !== undefined && value !== '');
        if (hasOralCavityData) {
            await OralCavity.create({ medicalId: medicalHistoryId.id, cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular });
        }


        res.status(201).json({ weight, medicalId: medicalHistoryId.id });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }

};

exports.update = async (req, res) => {
    const { id } = req.params;
    
    const {
        weight, size, tA, fC, fR, t, history1, history2, history3, history4, history5, history6, history7, history8,
        cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6,
        disease1, disease2, disease3, disease4,
        colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7,
        cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular
    } = req.body;

    try {
        const medicalHis = await MedicalHistory.findOne({ where: { id } });
        if (!medicalHis) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        await MedicalHistory.update({ weight, size, tA, fC, fR, t, history1, history2, history3, history4, history5, history6, history7, history8 }, { where: { id } });

        // valida Cardiovascular
        const hasCardiovascularData = [cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6].some(value => value !== null && value !== undefined && value !== '');
        const existingCardio = await CardiovascularSystem.findOne({ where: { medicalId: id } });
        if (existingCardio) {
            await CardiovascularSystem.update({ cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6 }, { where: { medicalId: id } });
        } else if (hasCardiovascularData) {
            await CardiovascularSystem.create({ medicalId: id, cardiovascular1, cardiovascular2, cardiovascular3, cardiovascular4, cardiovascular5, cardiovascular6 });
        }

        // valida ETS
        const hasEtsDiseaseData = [disease1, disease2, disease3, disease4].some(value => value !== null && value !== undefined && value !== '');
        const existingEts = await EtsDisease.findOne({ where: { medicalId: id } });
        if (existingEts) {
            await EtsDisease.update({ disease1, disease2, disease3, disease4 }, { where: { medicalId: id } });
        } else if (hasEtsDiseaseData){
            await EtsDisease.create({ medicalId: id, disease1, disease2, disease3, disease4 });
        }

        // validar PathologicalHistory
        const hasPathologicalHistoryData = [colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7].some(value => value !== null && value !== undefined && value !== '');
        const existingPathological = await PathologicalHistory.findOne({ where: { medicalId: id } });
        if (existingPathological) {
            await PathologicalHistory.update({ colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7 }, { where: { medicalId: id } });
        } else if (hasPathologicalHistoryData) {
            await PathologicalHistory.create({  medicalId: id, colitis, gastritis, gastroenteritis, asma, bronquitis, neumonia, tuberculosis, farinoamigdalitis, pathological1, pathological2, pathological3, pathological4, pathological5, pathological6, pathological7 });
        }

        const hasOralCavityData = [cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular].some(value => value !== null && value !== undefined && value !== '');
        const existingOralCavity = await OralCavity.findOne({ where: { medicalId: id } });
        if (existingOralCavity) {
            await OralCavity.update({ cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular }, { where: { medicalId: id } });
        } else if (hasOralCavityData) {
            await OralCavity.create({ medicalId: id, cavity1, cavity2, cavity3, dolor, luxacion, anquilosis, crepitacion, subluxacion, espasmoMuscular });
        }

        res.status(200).json({ message: 'Medical record updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.getAllMedicalForm = async (req, res) => {

    const { id } = req.params;

    try {

        const medicalHistoryData = await MedicalHistory.findAll({
            where: {patientId: id},
            include: [
                {
                    model: Patient,
                    include: {
                        model:Login
                    }
                }
                
            
            ]
        })

        res.status(200).json(medicalHistoryData);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


exports.getMedicalFormById = async (req, res) => {
    const { id } = req.params;

    try {
        const medical = await MedicalHistory.findOne({ where: { id }, include: [CardiovascularSystem, EtsDisease, PathologicalHistory, OralCavity] });
        
        if (!medical) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        res.status(200).json(medical);

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.deleteExpe = async (req, res) => {
    const { id } = req.params;

    try {
        const medical = await MedicalHistory.findOne({ where: { id } });
        if (!medical) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        await MedicalHistory.destroy({ where: { id } });
        await CardiovascularSystem.destroy({ where: { medicalId: id } });
        await EtsDisease.destroy({ where: { medicalId: id } });
        await PathologicalHistory.destroy({ where: { medicalId: id } });
        await OralCavity.destroy({ where: { medicalId: id } });

        res.status(200).json({ message: 'Medical record deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


