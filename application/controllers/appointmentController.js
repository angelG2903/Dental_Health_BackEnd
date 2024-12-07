const { Patient, Appointment, Login, Notification } = require('../../domain/models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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
            return res.status(400).json({ error: 'Appointment time must be between 9:00 AM and 6:00 PM' });
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

        // no permite que se duplique una cita URGE QUE SE REVISE -------------------------------------------
        const duplicateAppointment = await Appointment.findOne({
            where: {
                patientId: id,
                status: {
                    [Op.or]: ['aceptada', 'pendiente'], // Verifica ambos estados
                },
                date: {
                    [Op.gte]: new Date(), // Asegúrate de que la cita existente sea para hoy o una fecha futura
                },
            }
        });

        /* if (duplicateAppointment) {
            return res.status(400).json({ error: 'Appointment already exists for this patient' });
        } */
        // no permite que se duplique una cita URGE QUE SE REVISE -------------------------------------------

        const newAppointment = await Appointment.create({ patientId: id, date, time });

        const patientNameResult = await Login.findOne({
            where: { id: validationId.loginId },
            attributes: ['name']
        });

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

        const { date } = req.query;
        console.log("Fecha recibida:", date);

        if (!date) {
            return res.status(400).json({ message: 'La fecha es obligatoria' });
        }

        const appointment = await Appointment.findAll({
            where: {
                [Op.and]: [
                    {
                        date: date,
                    },
                    {
                        status: 'aceptada',
                    },
                ],
            },
            include: {
                model: Patient,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name'],
                },
            },
            order: [['time', 'ASC']],
        });

        res.status(200).json(appointment);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token inválido' });
        }
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}

exports.getAppointmentsByPatient = async (req, res) => {
    const token = req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const patient = await Patient.findOne({
            where: { loginId: decoded.loginId }
        });

        if (!patient) {
            return res.status(404).json({ message: 'No hay paciente con ese id' });
        }

        // Buscar citas con el `patientId` y estados `pendiente` o `aceptada`
        const appointments = await Appointment.findAll({
            where: {
                [Op.and]: [
                    { patientId: patient.id }, // Filtrar por el ID del paciente
                    { status: { [Op.in]: ['pendiente', 'aceptada'] } }, // Filtrar por los estados permitidos
                ],
            },
            include: {
                model: Patient,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name'],
                },
            },
            order: [['date', 'ASC'], ['time', 'ASC']], // Ordenar por fecha y hora
        });

        // Responder con las citas encontradas
        res.status(200).json(appointments);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token inválido' });
        }
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};

exports.aceptApp = async (req, res) => {

    const { id } = req.params;

    try {

        const appointment = await Appointment.findOne({ where: { id, status: "pendiente" } });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment  not found' });
        }

        appointment.status = 'aceptada';
        await appointment.save();

        res.status(200).json({ message: 'Cita aceptada.', appointment });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }

}

// hay que ver si la dejamos como status cancelada o mejor se elimina
exports.cancelApp = async (req, res) => {

    const { id } = req.params;

    try {

        const appointment = await Appointment.findOne({ where: { id, status: "pendiente" } });
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

exports.availableHours = async (req, res) => {
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM

    try {
        const { date } = req.query;

        // Validar formato de fecha (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD.' });
        }

        // Obtener la fecha y hora actual ajustada a la zona horaria de México
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23', // Formato 24 horas
        });

        const formattedDate = formatter.formatToParts(now);

        const currentDate = `${formattedDate.find(part => part.type === 'year').value}-${formattedDate.find(part => part.type === 'month').value}-${formattedDate.find(part => part.type === 'day').value}`;
        const currentHour = parseInt(formattedDate.find(part => part.type === 'hour').value, 10);

        // Verificar si la fecha es hoy y ya pasó el rango de horas permitidas
        if (date === currentDate && currentHour >= endHour) {
            return res.json({ date, freeHours: [] });
        }

        // Generar todas las horas dentro del rango permitido
        let availableHours = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            availableHours.push(`${hour.toString().padStart(2, '0')}:00:00`);
        }

        // Si la fecha es hoy, filtrar horas que ya pasaron
        if (date === currentDate) {
            availableHours = availableHours.filter((hour) => {
                const hourNumber = parseInt(hour.split(':')[0], 10);
                return hourNumber > currentHour;
            });
        }

        // Buscar citas ya ocupadas en la base de datos
        const appointments = await Appointment.findAll({
            where: {
                date,
                time: {
                    [Op.in]: availableHours, // Solo chequea horas dentro del rango permitido
                },
            },
            attributes: ['time'],
        });

        // Filtrar las horas disponibles
        const occupiedHours = appointments.map((a) => a.time);
        const freeHours = availableHours.filter((hour) => !occupiedHours.includes(hour));

        res.json({ date, freeHours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las horas disponibles' });
    }
};

