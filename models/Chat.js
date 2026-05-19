const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
    roomId: String,
    senderId: String,
    receiverId: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', ChatSchema);
