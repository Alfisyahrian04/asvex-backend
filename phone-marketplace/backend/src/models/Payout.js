const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  sellerId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: 'User'

  },

  amount: Number,

  status: {

    type: String,

    enum: [
      'pending',
      'approved',
      'rejected'
    ],

    default: 'pending'

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Payout',
  schema
);
