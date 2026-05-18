const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: String, enum: ['Flagship', 'Mid-range', 'Budget', 'Gaming', 'Second'], required: true },
    specs: {
        ram: String,
        storage: String,
        processor: String,
        camera: String,
        battery: String
    },
    description: String,
    image: String,
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    status: { type: String, default: 'Ready' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
