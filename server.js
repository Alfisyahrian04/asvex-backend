const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hp_marketplace')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Order Route Simple
app.post('/api/checkout', async (req, res) => {
    // Logic simpan order ke DB
    res.json({ message: "Order successful", orderId: "INV-" + Date.now() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));