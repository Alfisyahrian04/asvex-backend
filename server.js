const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('User Connected: ' + socket.id);

    // Join Room Chat
    socket.on('join_chat', (roomId) => {
        socket.join(roomId);
    });

    // Kirim Pesan Realtime
    socket.on('send_message', (data) => {
        // data: { roomId, message, senderName }
        socket.to(data.roomId).emit('receive_message', data);
    });

    socket.on('disconnect', () => console.log('User Disconnected'));
});

// Gunakan server.listen sebagai ganti app.listen
server.listen(PORT, () => console.log(`🚀 Server Ultimate Running on ${PORT}`));
