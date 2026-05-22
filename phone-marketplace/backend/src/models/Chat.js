const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  senderId: String,

  receiverId: String,

  roomId: String,

  message: String,

  isRead: {

    type: Boolean,

    default: false

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Chat',
  schema
);
