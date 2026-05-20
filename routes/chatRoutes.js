const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

router.post('/', async (req, res) => {
    const c = new Chat(req.body);
    await c.save();
    res.json(c);
});

router.get('/:roomId', async (req, res) => {
    const data = await Chat.find({ roomId: req.params.roomId }).sort({createdAt: 1});
    res.json(data);
});

router.get('/rooms/:userId', async (req, res) => {
    const data = await Chat.find({ $or: [{senderId: req.params.userId}, {receiverId: req.params.userId}] }).sort({createdAt: -1});
    const roomMap = new Map();
    data.forEach(item => {
        if (!roomMap.has(item.roomId)) {
            roomMap.set(item.roomId, item);
        }
    });
    res.json(Array.from(roomMap.values()));
});

module.exports = router;
