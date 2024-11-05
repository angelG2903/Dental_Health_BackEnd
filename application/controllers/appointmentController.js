const { Patient, Appointment, Login, Notification } = require('../../domain/models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const today = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0));
const endOfDay = new Date(today.setHours(23, 59, 59, 999));

exports.register = async (req, res) => {
    const { id } = req.params;

    const { date, time } = req.body;

    try {

        const validationId = await Patient.findOne({ 
            where: { id }
        });

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
        const endTime = 1800; // 6:00 PM -> 1800

        // Verificar que la hora esté dentro del rango permitido
        if (appointmentTime < startTime || appointmentTime >= endTime) {
            return res.status(400).json({ error: 'Appointment time must be between 9:00 AM and 5:00 PM' });
        }

        // Verificar que no haya un conflicto de horario (misma hora)
        const conflictAppointment = await Appointment.findOne({
            where: {
               date,
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

        /* if (duplicateAppointment) {
            return res.status(400).json({ error: 'Appointment already exists for this patient' });
        } */

        const newAppointment = await Appointment.create({ patientId: id, date, time });

        const patientNameResult = await Login.findOne({ 
            where: { id: validationId.loginId },
            attributes: ['name']
        });
        const patientName = patientNameResult.name;

        // falta meter la informacion de cuando fue su ultima cita si es que tuvo :D

        const notification = await Notification.create({
            patientId: id,
            appointmentId: newAppointment.id
        });
        // notification
        const io = req.app.get('io');

        io.emit('newNotification', { message: 'Nueva cita solicitada' });

        res.status(201).json({ newAppointment, notification });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.getAppointments = async (req, res) => {

    const token = req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const appointment = await Appointment.findAll({
            where: { 
                date:{ [Op.between]: [startOfDay, endOfDay] } 
            },
            include: {
                model: Patient,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name']
                },
            },
            order: [['time', 'ASC']]
        });

        res.status(200).json(appointment);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token inválido' });
        }
        res.status(500).json({ error: 'Server error', details: error.message });
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

