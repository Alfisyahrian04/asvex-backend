const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerName: String,
    name: { type: String, required: true },
    brand: { type: String, default: "Generic" },
    price: { type: Number, required: true }, // Harga murni dari seller
    priceWithTax: { type: Number }, // Harga + PPN 11% (Dihitung di backend)
    stock: { type: Number, default: 0 },
    weight: { type: Number, default: 0 }, // Untuk produk fisik (ongkir)
    category: String,
    type: { type: String, enum: ['physical', 'digital', 'service'], required: true },
    image: { type: String, required: true },
    description: String,
    
    // Spesifikasi Dinamis (Scalable untuk semua kategori)
    specifications: { type: Map, of: String }, 
    // Contoh: { "RAM": "8GB", "Processor": "M2" } atau { "Region": "Global", "Voucher": "Garena" }
    
    variants: [{ name: String, priceExtra: Number }],
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
