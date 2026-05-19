const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: String, buyerEmail: String, buyerName: String, sellerId: String,
    items: Array, total: Number, paymentProof: String, packingProof: String, unboxingProof: String,
    status: { type: String, default: 'Waiting_Payment' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
