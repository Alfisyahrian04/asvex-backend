const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || "ALFI123";
const transporter = nodemailer.createTransport({
    service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role, adminKey } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        let finalRole = (adminKey === "ALFI_ADMIN_PRO") ? 'admin' : role;
        const newUser = new User({ username, email, password: hashed, role: finalRole });
        await newUser.save();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && user.status === 'banned') return res.status(403).json({ message: "Akun Anda di-banned!" });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role, email: user.email } });
    } else { res.status(401).json({ success: false, message: "Email/Password Salah" }); }
});

router.patch('/:id/bank', async (req, res) => {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

router.get('/sellers', async (req, res) => {
    const data = await User.find({ role: 'seller' });
    res.json(data);
});

router.patch('/:id/status', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true });
});

router.post('/request-otp', async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await User.findOneAndUpdate({ email: req.body.email }, { otp, otpExpires: Date.now() + 600000 });
    await transporter.sendMail({ from: 'AL Gadget', to: req.body.email, subject: 'OTP Password', text: `Kode OTP: ${otp}` });
    res.json({ success: true });
});

router.put('/reset-password', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, otp: req.body.otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "OTP Salah" });
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.otp = null; await user.save();
    res.json({ success: true });
});

module.exports = router;
