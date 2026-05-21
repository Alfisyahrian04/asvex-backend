const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  orderId: String,

  buyerId: String,

  sellerId: String,

  reason: String,

  evidence: [String],

  status: {

    type: String,

    default: 'pending'

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Complaint',
  schema
);
