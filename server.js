const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { Message } = require('./domain/models');
// const cors = require('cors');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// app.use(cors()); // Middleware de CORS para Express



const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Manejar eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado', socket.id);

    socket.on('disconnect', () => {
        delete socket.id;
          
    });
});

app.set('io', io);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
