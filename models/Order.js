const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { 
        type: String, 
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    items: { 
        type: Array, 
        required: true 
    }, // Menyimpan daftar HP yang dibeli
    total: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        default: 'Transfer Bank' 
    },
    paymentProof: { 
        type: String 
    }, // TEMPAT MENYIMPAN FOTO BUKTI TRANSFER (BASE64)
    status: { 
        type: String, 
        default: 'Pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', OrderSchema);
