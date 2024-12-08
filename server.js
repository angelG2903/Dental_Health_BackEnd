const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { Message } = require('./domain/models');
// const cors = require('cors');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// app.use(cors()); // Middleware de CORS para Express


app.use(express.urlencoded({ limit: '50mb', extended: true })); // Aumenta el límite

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const userSockets = {};

// Manejar eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado', socket.id);

    // Escuchar cuando el cliente envía su identificador único (userId)
    socket.on('register', (userId) => {
        userSockets[userId] = socket.id; // Asociar userId con socket.id
        console.log(`Usuario registrado: ${userId} => ${socket.id}`);
    });

    // Escuchar un mensaje dirigido
    socket.on('send_private_message', async (data) => {
        const { fromUserId, toUserId, message } = data;

        // Guardar el mensaje en la base de datos
        try {
            const newMessage = await Message.create({
                senderId: fromUserId,
                receiverId: toUserId,
                message: message,
            });

            // Enviar mensaje al destinatario si está conectado
            const targetSocketId = userSockets[toUserId];
            if (targetSocketId) {
                io.to(targetSocketId).emit('receive_private_message', {
                    message: newMessage.message,
                    fromUserId: newMessage.senderId,
                    toUserId: newMessage.receiverId,
                });
            }
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });

    socket.on('confirmed', async (data) => {
        const { toUserId } = data;
        const targetSocketId = userSockets[toUserId];
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_private_notification', {
                message: 'aceptada'
            });
        }
    });

    socket.on('cancel', async (data) => {
        const { toUserId } = data;
        const targetSocketId = userSockets[toUserId];
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_private_notification', {
                message: 'cancelada'
            });
        }
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        for (const [userId, id] of Object.entries(userSockets)) {
            if (id === socket.id) {
                delete userSockets[userId];
                console.log(`Usuario desconectado: ${userId}`);
                break;
            }
        }
    });
});

app.set('io', io);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
