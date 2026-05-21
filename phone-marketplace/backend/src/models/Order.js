const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  orderId: String,

  buyerId: String,

  buyerName: String,

  items: Array,

  total: Number,

  shippingAddress: Object,

  paymentMethod: String,

  paymentStatus: {

    type: String,

    default: 'pending'

  },

  status: {

    type: String,

    default: 'pending'

  },

  idempotencyKey: {

    type: String,

    unique: true

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Order',
  schema
);
