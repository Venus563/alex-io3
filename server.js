
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {

    players[socket.id] = {
        id: socket.id,
        x: Math.random() * 5000,
        y: Math.random() * 5000,
        mass: 40
    };

    socket.on('move', (data) => {
        const player = players[socket.id];
        if (!player) return;

        player.x += data.dx * 5;
        player.y += data.dy * 5;
    });

    socket.on('split', () => {
        const player = players[socket.id];
        if (!player || player.mass < 40) return;
        player.mass /= 2;
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
    });

    setInterval(() => {
        io.emit('update', players);
    }, 1000 / 30);
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});
