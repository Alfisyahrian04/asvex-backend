const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // 1. Identitas Pesanan
    orderId: { type: String, required: true },
    
    // 2. Data Buyer (Akun & Kontak)
    buyerId: { type: String, required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true }, // Poin 11: No Telp Buyer
    
    // 3. Data Pengiriman (Nama & Alamat Inputan)
    customerName: { type: String, required: true }, // Nama di Form Checkout
    address: { type: String, required: true },
    
    // 4. Data Seller
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    
    // 5. Rincian Barang & Biaya
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true }, // Poin 1: Bank/E-wallet
    
    // 6. Bukti-Bukti Transaksi (File Base64)
    paymentProof: { type: String },  // Dari Buyer (Struk Transfer)
    packingProof: { type: String },  // Dari Seller (Video/Foto Packing)
    unboxingProof: { type: String }, // Dari Buyer (Video Unboxing)
    
    // 7. Fitur Retur & Komplain (Poin 2)
    complainReason: { type: String },
    returResi: { type: String },     // Resi pengiriman balik dari buyer
    returPhoto: { type: String },    // Foto paket yang dikembalikan
    
    // 8. Pencairan Dana (Poin 11)
    adminTransferProof: { type: String }, // Bukti Admin transfer ke Seller
    
    // 9. Status Alur Rekber (Sangat Teliti)
    status: { 
        type: String, 
        enum: [
            'Waiting_Payment', // Baru Checkout
            'Escrow_Held',     // Dana sudah masuk ke Admin
            'Shipped',         // Seller sudah kirim barang
            'Received',        // Buyer lapor barang sampai
            'Complained',      // Buyer ajukan komplain (Dana ditahan)
            'Retur_Processing',// Proses kirim balik barang
            'Retur_Received',  // Seller sudah terima returan
            'Completed',       // Transaksi Selesai (Siap dicairkan)
            'Funds_Released',  // Admin sudah transfer ke Seller
            'Cancelled'        // Dibatalkan
        ],
        default: 'Waiting_Payment' 
    },

    // 10. Fitur Rating Sekali Pakai (Poin 9)
    isRated: { type: Boolean, default: false },
    review: {
        score: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
