const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: String, buyerEmail: String, buyerName: String, sellerId: String,
    items: Array, total: Number, paymentProof: String, packingProof: String, unboxingProof: String,
    status: { type: String, default: 'Waiting_Payment' }, // Waiting_Payment, Escrow_Held, Shipped, Complained, Completed, Cancelled
    complainReason: String, complainVideo: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
