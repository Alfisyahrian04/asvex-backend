const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    sellerId: String, sellerName: String, 
    name: String, brand: String, price: Number, priceWithTax: Number,
    stock: Number, weight: Number, category: String, image: String,
    type: { type: String, enum: ['physical', 'digital', 'service'], required: true },
    description: String,
    specifications: { type: Map, of: String }, // Dynamic Specs
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
});
module.exports = mongoose.model('Product', ProductSchema);
