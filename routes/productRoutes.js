const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Add product
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: 'Product added!' });
});

// Delete product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted!' });
});

module.exports = router;
