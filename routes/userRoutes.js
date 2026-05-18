const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint Register
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ success: true, message: "Berhasil daftar!" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Email sudah terdaftar atau data tidak lengkap." });
    }
});

// Endpoint Login Simple
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
        res.json({ 
            success: true, 
            message: "Login Berhasil!", 
            user: { username: user.username, role: user.role } 
        });
    } else {
        res.status(401).json({ success: false, message: "Email atau password salah!" });
    }
});

module.exports = router;
