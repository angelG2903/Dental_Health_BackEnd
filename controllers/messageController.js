const { Message } = require('../models');
const { Op } = require('sequelize');

// Función para guardar un mensaje en la base de datos
exports.saveMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    try {
        const newMessage = await Message.create({ senderId, receiverId, message });
        res.status(201).json(newMessage); // Responde con el mensaje guardado
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
};
  
// Función para recuperar mensajes de la base de datos
exports.getMessages = async (req, res) => {
    const { userId } = req.query;

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ senderId: userId }, { receiverId: userId }],
            },
            order: [['createdAt', 'ASC']],
        });

        res.json(messages);
    } catch (error) {
        console.error('Error al recuperar los mensajes:', error);
        res.status(500).json({ error: 'Error al recuperar los mensajes' });
    }
};
