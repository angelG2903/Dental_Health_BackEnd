const { Notification, Patient, Login, Appointment } = require('../../domain/models');
const { Op } = require('sequelize');

exports.getNotifications = async (req, res) => {
    try {
        const notification = await Notification.findAll({
            include: [
                {
                    model: Patient,
                    include: {
                        model: Login
                    },
                },
                {
                    model: Appointment,
                    attributes: ['date', 'time'],
                    where: {
                        status: 'pendiente', // Filtra las notificaciones por status "pendiente" en Appointment
                    },
                }
            ],
            order: [['createdAt', 'ASC']] 
        });

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.getNotificationsById = async (req, res) => {

    const { id } = req.params;

    try {
        const notification = await Notification.findAll({
            include: [
                {
                    model: Patient,
                    include: {
                        model: Login
                    },
                },
                {
                    model: Appointment,
                    where: {
                        [Op.and]: [
                            { patientId: id },
                            { status: { [Op.in]: ['cancelada', 'aceptada'] } }, // Filtrar por los estados permitidos
                        ],
                    },
                }
            ],
            order: [['createdAt', 'ASC']] 
        });

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.deletedNotifications = async (req, res) => {

    const { id } = req.params;

    try {

        const notificacion = await Notification.findOne({
            where: { id }
        });

        if (!notificacion) {
            return res.status(404).json({ message: 'No hay notificación con ese id' });
        }


        await Notification.destroy({ where: { id } });

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        
    }
};