const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerName: String,
    name: String, brand: String, price: Number, category: String, image: String, stock: Number,
    description: String,
    specs: { ram: String, internal: String, processor: String, camFront: String, camBack: String, battery: String },
    variants: Array, // ["Black", "Gold"]
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
});
module.exports = mongoose.model('Product', ProductSchema);
