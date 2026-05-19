const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerName: String,
    name: String, brand: String, price: Number, category: String, image: String, stock: Number,
    description: String,
    specs: {
        ram: String, storage: String, processor: String, 
        camFront: String, camBack: String, battery: String
    },
    variants: { type: Array, default: [] } // Array of colors: ["Black", "Gold"]
});
module.exports = mongoose.model('Product', ProductSchema);
