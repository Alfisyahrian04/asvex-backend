const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  userId: String,

  type: {

    type: String,

    enum: [

      'income',

      'withdraw',

      'refund'

    ]

  },

  amount: Number,

  note: String

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'WalletTransaction',
  schema
);
