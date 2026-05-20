const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // Identitas Transaksi
    orderId: { type: String, required: true },
    
    // Data Pembeli (Buyer)
    buyerId: { type: String, required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true }, // Tambahan Fitur No. HP
    
    // Data Pengiriman (Shipping)
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    
    // Data Penjual (Seller)
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    
    // Detail Barang
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    
    // Pembayaran Buyer ke Admin
    paymentMethod: { type: String, required: true }, // Bank atau E-Wallet
    paymentProof: { type: String }, // Foto Struk dari Buyer
    
    // Logistik & Rekber (Escrow)
    packingProof: { type: String }, // Video/Foto Packing dari Seller
    unboxingProof: { type: String }, // Video Unboxing dari Buyer
    
    // Fitur Komplain & Retur (Point 2)
    complainReason: { type: String },
    returResi: { type: String }, // No Resi Retur dari Buyer
    returPhoto: { type: String }, // Foto Paket Retur dari Buyer
    
    // Pencairan Dana Admin ke Seller (Point 11)
    adminTransferProof: { type: String }, // Bukti transfer Admin ke Seller
    
    // Status Transaksi (Point 2 & 11)
    status: { 
        type: String, 
        enum: [
            'Waiting_Payment', // Menunggu Buyer Bayar
            'Escrow_Held',     // Dana sudah di Admin
            'Shipped',         // Seller sudah kirim barang
            'Received',        // Buyer terima barang (tahap unboxing)
            'Complained',      // Buyer ajukan komplain
            'Retur_Processing',// Buyer sedang kirim balik barang
            'Retur_Received',  // Seller sudah terima barang returan
            'Completed',       // Transaksi Selesai (Dana siap cair)
            'Funds_Released',  // Dana sudah dicairkan ke Seller
            'Cancelled'        // Dibatalkan/Refund
        ],
        default: 'Waiting_Payment' 
    },

    // Fitur Rating Akumulasi (Point 3 & 9)
    isRated: { type: Boolean, default: false }, // Biar cuma bisa rating 1x
    review: {
        score: { type: Number, min: 1, max: 5 }, // 1-5 Bintang
        comment: { type: String },
        date: { type: Date }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
