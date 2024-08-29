const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(cors()); // Middleware de CORS para Express

const io = new Server(server, {
    cors: {
        origin: 'http://192.168.100.4:8081',
        methods: ['GET', 'POST']
    }
});

// Manejar eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Puedes definir aquí los eventos personalizados que deseas manejar
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.set('io', io);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
