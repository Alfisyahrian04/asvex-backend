const OrderSchema = new mongoose.Schema({
    orderId: String, buyerId: String, buyerName: String, buyerPhone: String, sellerId: String, sellerName: String,
    items: Array, total: Number, paymentProof: String, packingProof: String, unboxingProof: String,
    adminTransferProof: String, // Bukti transfer dari Admin ke Seller
    status: { type: String, default: 'Waiting_Payment' }, 
    isRated: { type: Boolean, default: false },
    rating: { score: Number, comment: String, date: Date },
    createdAt: { type: Date, default: Date.now }
});
