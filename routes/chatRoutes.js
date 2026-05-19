const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat'); // Buat model Chat sederhana (senderId, receiverId, msg)

router.post('/', async (req, res) => {
    const newChat = new Chat(req.body);
    await newChat.save();
    res.json(newChat);
});

router.get('/:roomId', async (req, res) => {
    const data = await Chat.find({ roomId: req.params.roomId }).sort({createdAt: 1});
    res.json(data);
});
module.exports = router;
