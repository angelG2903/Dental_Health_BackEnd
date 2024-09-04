const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { Message } = require('./domain/models');
// const cors = require('cors');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// app.use(cors()); // Middleware de CORS para Express

const userSockets = {};

const io = new Server(server, {
    cors: {
        origin: 'http://192.168.100.4:8081',
        methods: ['GET', 'POST']
    }
});

// Manejar eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado', socket.id);

    
    socket.on('user_connected', (userId) => {
        userSockets[userId] = socket.id;
        console.log(`Usuario ${userId} conectado con el socket ${socket.id}`);
    });

    // Escuchar mensajes enviados entre usuarios
    socket.on('send_message', async ({ senderId, receiverId, message }) => {
        const receiverSocketId = userSockets[receiverId];

    // Guardar el mensaje en la base de datos
        try {
            await Message.create({ senderId, receiverId, message });
            console.log(`Mensaje guardado en la base de datos de ${senderId} a ${receiverId}: ${message}`);
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }

        // Enviar mensaje al receptor si está conectado
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', { senderId, message });
        } else {
            console.log(`El receptor ${receiverId} no está conectado.`);
        }
    });
    
    socket.on('disconnect', () => {
        for (const [userId, socketId] of Object.entries(userSockets)) {
            if (socketId === socket.id) {
              delete userSockets[userId];
              console.log(`Usuario ${userId} desconectado.`);
              break;
            }
        }
    });
});

app.set('io', io);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
