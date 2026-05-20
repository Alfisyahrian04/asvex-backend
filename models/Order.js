const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: String,
    buyerId: String, buyerName: String, buyerEmail: String, buyerPhone: String,
    sellerId: String, sellerName: String,
    items: Array, total: Number, paymentMethod: String,
    paymentProof: String, packingProof: String, unboxingProof: String,
    returResi: String, returPhoto: String,
    status: { 
        type: String, 
        enum: ['Waiting_Payment', 'Escrow_Held', 'Shipped', 'Received', 'Complained', 'Retur_Processing', 'Retur_Received', 'Completed', 'Cancelled'],
        default: 'Waiting_Payment' 
    },
    review: { rating: Number, comment: String, date: Date },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
