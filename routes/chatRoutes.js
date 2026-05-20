const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

function getRoomId(a, b) {
    return [a, b].sort().join('_');
}

/* =======================
   SEND CHAT (FIX ROOM ID)
======================= */
router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const roomId = getRoomId(senderId, receiverId);

        const c = new Chat({
            ...req.body,
            roomId
        });

        await c.save();
        res.json(c);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* =======================
   GET CHAT BY ROOM
======================= */
router.get('/:roomId', async (req, res) => {
    try {
        const data = await Chat.find({ roomId: req.params.roomId })
            .sort({ createdAt: 1 });

        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* =======================
   GET ROOMS USER (FIX ORDER BUG)
======================= */
router.get('/rooms/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const chats = await Chat.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: -1 });

        const roomMap = new Map();

        chats.forEach(chat => {
            if (!roomMap.has(chat.roomId)) {
                roomMap.set(chat.roomId, chat);
            }
        });

        res.json(Array.from(roomMap.values()));
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
