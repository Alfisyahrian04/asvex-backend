const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    sellerId: String,
    sellerName: String,
    name: String,
    brand: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    description: String,
    specs: {
        ram: String,
        internal: String,
        cpu: String,
        camFront: String,
        camBack: String,
        battery: String
    },
    variants: { type: Array, default: [] },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);
