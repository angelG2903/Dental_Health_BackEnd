const { Notification, Patient, Login, Appointment } = require('../../domain/models');

exports.getNotifications = async (req, res) => {
    try {
        const notification = await Notification.findAll({
            include: [
                {
                    model: Patient,
                    attributes: ['id'],
                    include: {
                        model: Login,
                        attributes: ['name']
                    },
                },
                {
                    model: Appointment,
                    attributes: ['date', 'time']
                }
            ],
            order: [['createdAt', 'ASC']] 
        });

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};