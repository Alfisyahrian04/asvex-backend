const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: String,
    customerName: String,
    address: String,
    phone: String,
    items: Array,
    total: Number,
    paymentMethod: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
