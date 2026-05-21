const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE & LIMITS ---
app.use(cors());
// Limit 50MB wajib untuk menampung Foto Bukti Transfer & Video Unboxing/Packing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- 3. ROUTES SETUP ---
// Menghubungkan semua fitur ke mesin API
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Health Check
app.get('/', (req, res) => res.send("🚀 AL GADGET ULTIMATE API - ONLINE"));

// --- 4. SERVER & SOCKET.IO INTEGRATION ---
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { 
        origin: "*", // Mengizinkan akses dari HP/Frontend mana saja
        methods: ["GET", "POST"]
    } 
});

// Logika Chat Realtime (Shopee/Tokopedia Style)
io.on('connection', (socket) => {
    console.log('📡 User Connected to Socket: ' + socket.id);

    // Masuk ke Kamar Chat Berdasarkan Room ID
    socket.on('join_chat', (roomId) => {
        socket.join(roomId);
        console.log(`💬 User joined room: ${roomId}`);
    });

    // Kirim & Terima Pesan Tanpa Refresh (Realtime)
    socket.on('send_message', (data) => {
        // data: { roomId, message, senderName, senderId }
        socket.to(data.roomId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('👋 User Disconnected');
    });
});

// --- 5. RUN SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 SERVER ULTIMATE RUNNING ON PORT ${PORT}
    ✅ REALTIME CHAT SYSTEM ACTIVE
    ✅ ESCROW REKBER SYSTEM ACTIVE
    =========================================
    `);
});
