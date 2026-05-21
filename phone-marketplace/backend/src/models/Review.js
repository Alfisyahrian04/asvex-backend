const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  productId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: 'Product'

  },

  buyerId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: 'User'

  },

  rating: Number,

  comment: String,

  images: [String],

  helpfulCount: {

    type: Number,

    default: 0

  },

  verifiedPurchase: {

    type: Boolean,

    default: true

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Review',
  schema
);
