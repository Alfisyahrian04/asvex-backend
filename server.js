const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI).then(() => console.log("✅ DB Connected"));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

io.on('connection', (socket) => {
    socket.on('join_chat', (roomId) => socket.join(roomId));
    socket.on('send_message', (data) => io.to(data.roomId).emit('receive_message', data));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Ultimate Server on ${PORT}`));
