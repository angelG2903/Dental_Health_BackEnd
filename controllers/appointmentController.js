const { Op } = require('sequelize');
const { Patient, Appointment } = require('../models');

exports.register = async (req, res) => {
    const { id } = req.params;

    const { date, time } = req.body;

    try {

        const validationId = await Patient.findOne({ where: { id } });
        if (!validationId) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        if (!date || !time) {
            return res.status(400).json({ error: 'Date and Time are required' });
        }

        // Validar que la hora esté en el formato correcto (HH:mm:ss)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        if (!time.match(timeRegex)) {
            return res.status(400).json({ error: 'Invalid time format' });
        }

        // Convertir la hora a un número entero para facilitar la comparación
        const [hour, minute] = time.split(':').map(Number);
        const appointmentTime = hour * 100 + minute; // Ej: 14:30 -> 1430
        const startTime = 900; // 9:00 AM -> 0900
        const endTime = 1800; // 5:00 PM -> 1700

        // Verificar que la hora esté dentro del rango permitido
        if (appointmentTime < startTime || appointmentTime >= endTime) {
            return res.status(400).json({ error: 'Appointment time must be between 9:00 AM and 5:00 PM' });
        }

        // Verificar que no haya un conflicto de horario (misma hora)
        const conflictAppointment = await Appointment.findOne({
            where: {
               patientId: id,
               time
            }
        });

        if (conflictAppointment) {
            return res.status(400).json({ error: 'There is already an appointment at this time' });
        }

        // no permite que se duplique una cita
        const duplicateAppointment = await Appointment.findOne({
            where: {
                patientId: id
            }
        });

        if (duplicateAppointment) {
            return res.status(400).json({ error: 'Appointment already exists for this patient' });
        }

        await Appointment.create({ patientId: id, date, time });

        res.status(201).json({ patientId: id, date, time });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.aceptApp = async (req, res) => {
    
    const { id } = req.params;

    try {

        const appointment  = await Appointment.findOne({ where: { id, status: "pendiente" } });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment  not found' });
        }

        appointment.status = 'aceptada';
        await appointment.save();

        // Aquí iría la lógica para enviar una notificación
        // sendNotification(appointment.patientId, 'Tu cita ha sido aceptada');

        res.status(200).json({ message: 'Cita aceptada.', appointment });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }

}

// hay que ver si la dejamos como status cancelada o mejor se elimina
exports.cancelApp = async (req, res) => {
    
    const { id } = req.params;

    try {

        const appointment  = await Appointment.findOne({ where: { id, status: "pendiente" } });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment  not found' });
        }

        appointment.status = 'cancelada';
        await appointment.save();

        // Aquí iría la lógica para enviar una notificación
        // sendNotification(appointment.patientId, 'Tu cita ha sido cancelada');

        res.status(200).json({ message: 'Cita cancelada.', appointment });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }

}
