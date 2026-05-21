const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  userId: String,

  title: String,

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
  'Notification',
  schema
);
