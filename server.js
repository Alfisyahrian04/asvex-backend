const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json()); // Agar bisa menerima data JSON

// 2. Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/phone_db';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// 3. Health Check (Untuk cek apakah server jalan)
app.get('/', (req, res) => {
    res.send('API Marketplace HP - Server is Running 🚀');
});

// 4. Import & Use Routes
// Pastikan folder 'routes' dan nama file sudah sesuai (Case Sensitive)
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 5. Port Setting (Railway membutuhkan process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
