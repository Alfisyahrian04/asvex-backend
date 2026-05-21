const mongoose =
require('mongoose');

const specificationSchema =
new mongoose.Schema({

  key: String,

  value: String

}, {
  _id: false
});

const schema =
new mongoose.Schema({

  name: String,

  slug: String,

  brand: String,

  category: String,

  type: {

    type: String,

    enum: [
      'physical',
      'digital',
      'service'
    ]

  },

  description: String,

  images: [String],

  price: Number,

  stock: Number,

  specifications: [
    specificationSchema
  ],

  sellerId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: 'User'

  },

  sellerName: String,

  rating: {

    type: Number,

    default: 0

  },

  totalReview: {

    type: Number,

    default: 0

  },

  totalSold: {

    type: Number,

    default: 0

  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'Product',
  schema
);
