const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  userId: String,

  csId: String,

  orderId: String,

  title: String,

  message: String,

  priority: {

    type: String,

    enum: [
      'low',
      'medium',
      'high'
    ]

  },

  status: {

    type: String,

    default: 'open'

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Ticket',
  schema
);
