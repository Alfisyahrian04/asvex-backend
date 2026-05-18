const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    description: String,
    specs: {
        ram: String,
        storage: String,
        processor: String,
        camera: String,
        battery: String
    }
});

module.exports = mongoose.model('Product', ProductSchema);
