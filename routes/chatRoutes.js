const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat'); // Buat model Chat: senderId, receiverId, roomId, message
const { protect } = require('../middleware/auth');

// 1. Ambil History Chat berdasarkan Room
router.get('/:roomId', protect, async (req, res) => {
    const messages = await Chat.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
});

// 2. Simpan Chat Baru
router.post('/', protect, async (req, res) => {
    const { roomId, receiverId, message } = req.body;
    const chat = new Chat({
        roomId,
        senderId: req.user._id,
        senderName: req.user.username,
        receiverId,
        message
    });
    await chat.save();
    res.json(chat);
});

module.exports = router;
