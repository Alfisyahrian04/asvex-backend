const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Kirim Pesan
router.post('/', async (req, res) => {
    try {
        const newChat = new Chat(req.body);
        await newChat.save();
        res.json(newChat);
    } catch (err) { res.status(500).json(err); }
});

// Ambil Pesan di Room tertentu
router.get('/:roomId', async (req, res) => {
    const data = await Chat.find({ roomId: req.params.roomId }).sort({createdAt: 1});
    res.json(data);
});

// Ambil daftar chat room untuk User/Seller tertentu (Inbox)
router.get('/rooms/:userId', async (req, res) => {
    const data = await Chat.find({ 
        $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }] 
    }).sort({ createdAt: -1 });
    
    // Grouping unik berdasarkan Room ID agar tidak duplikat
    const rooms = [...new Map(data.map(item => [item['roomId'], item])).values()];
    res.json(rooms);
});

module.exports = router;
