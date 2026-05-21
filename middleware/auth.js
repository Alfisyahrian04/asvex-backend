const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "ALFI123");
            req.user = await User.findById(decoded.id).select('-password');
            
            // Cek Banned Status
            if (req.user.status === 'banned') {
                return res.status(403).json({ message: "Akun Anda di-banned!" });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Token tidak valid" });
        }
    }
    if (!token) res.status(401).json({ message: "Tidak ada token" });
};

// Middleware Multi-Role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user.role} tidak diizinkan!` });
        }
        next();
    };
};

module.exports = { protect, authorize };
