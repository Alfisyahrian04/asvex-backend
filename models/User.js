const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    bankInfo: { provider: String, accNumber: String, accName: String },
    walletInfo: { provider: String, phone: String, accName: String }
});
