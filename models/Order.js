const mongoose = require('mongoose'); // BARIS INI WAJIB ADA!

const OrderSchema = new mongoose.Schema({
    orderId: String,
    buyerId: String,
    buyerEmail: String,
    buyerName: String,
    buyerPhone: String,
    customerName: String,
    address: String,
    sellerId: String,
    sellerName: String,
    items: Array,
    total: Number,
    paymentProof: String,
    packingProof: String,
    unboxingProof: String,
    adminTransferProof: String,
    status: { type: String, default: 'Waiting_Payment' },
    isRated: { type: Boolean, default: false },
    review: {
        rating: Number,
        comment: String,
        date: Date
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
