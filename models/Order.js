const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: String, buyerId: String, buyerName: String, buyerEmail: String, buyerPhone: String,
    sellerId: String, sellerName: String, items: Array,
    total: Number, adminFee: Number, sellerIncome: Number,
    type: String, address: String, paymentMethod: String, paymentProof: String,
    packingProof: String, unboxingProof: String, adminTransferProof: String,
    digitalData: { uid: String, server: String, nickname: String, codeSent: String },
    status: { type: String, default: 'Pending_Payment' },
    isRated: { type: Boolean, default: false },
    review: { score: Number, comment: String },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
