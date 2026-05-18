const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI).then(() => console.log('✅ MongoDB Connected')).catch(err => console.log(err));

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => res.send('🚀 Asvex Server is Live!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
