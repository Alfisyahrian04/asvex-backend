const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: String,
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['physical', 'digital', 'service'] },
    items: Array,
    total: Number,
    adminFee: Number, // 3%
    sellerIncome: Number, // Total - 3%
    
    // Data Pengiriman (Physical)
    shipping: { courier: String, resi: String, cost: Number, address: String },
    
    // Data Game (Digital - Itemku Style)
    digitalData: { uid: String, server: String, nickname: String, codeSent: String },
    
    payment: { method: String, status: String, proof: String, midtransId: String },
    
    // Workflow Status
    status: { 
        type: String, 
        enum: ['Pending_Payment', 'Paid', 'Processing', 'Shipping', 'Delivered', 'Completed', 'Complaint', 'Refunded'],
        default: 'Pending_Payment' 
    },
    
    proofs: { packing: String, unboxing: String },
    isRated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
