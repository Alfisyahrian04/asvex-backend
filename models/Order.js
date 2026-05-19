const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: String,
    buyerEmail: String,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: Array,
    total: Number,
    paymentProof: String,
    packingProof: String, // Bukti video/foto dari Seller
    unboxingProof: String, // Bukti video/foto dari Buyer
    status: { 
        type: String, 
        enum: ['Waiting_Payment', 'Escrow_Held', 'Seller_Packing', 'Shipped', 'Unboxing_Check', 'Completed', 'Cancelled'],
        default: 'Waiting_Payment' 
    },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
