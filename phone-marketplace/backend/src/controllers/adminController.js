const User =
require('../models/User');

const Order =
require('../models/Order');


/* ==============================
GET ALL USERS
============================== */

const getAllUsers =
async(req,res)=>{
try{

const users =
await User.find()
.select('-password');

res.status(200).json({
success:true,
users
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
VERIFY SELLER
============================== */

const verifySeller =
async(req,res)=>{
try{

const user =
await User.findById(
req.params.id
);

if(!user){
return res.status(404).json({
message:'User tidak ditemukan'
});
}

user.isVerifiedSeller =
true;

await user.save();

res.status(200).json({
success:true,
message:'Seller berhasil diverifikasi',
user
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
BAN USER
============================== */

const banUser =
async(req,res)=>{
try{

const user =
await User.findById(
req.params.id
);

if(!user){
return res.status(404).json({
message:'User tidak ditemukan'
});
}

user.isBanned =
true;

await user.save();

res.status(200).json({
success:true,
message:'User berhasil dibanned'
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
GET PAYOUTS
============================== */

const getPayouts =
async(req,res)=>{
try{

const payouts =
await Order.find({
payoutStatus:'requested'
})
.populate('seller')
.sort({createdAt:-1});

res.status(200).json({
success:true,
payouts
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};



/* ==============================
GET PENDING PAYMENTS
PATCH
============================== */

const getPendingPayments =
async(req,res)=>{
try{

const orders =
await Order.find({

paymentStatus:
'waiting_verification'

})
.populate(
'buyer',
'username'
)
.populate(
'product'
)
.sort({
createdAt:-1
});

res.status(200).json({
success:true,
orders
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
APPROVE PAYOUT
============================== */

const approvePayout =
async(req,res)=>{
try{

const order =
await Order.findById(
req.params.id
);

if(!order){
return res.status(404).json({
message:'Order tidak ditemukan'
});
}

order.payoutStatus='paid';

await order.save();

res.status(200).json({
success:true,
message:'Payout berhasil dicairkan',
order
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
VERIFY MANUAL PAYMENT
============================== */

const verifyManualPayment =
async(req,res)=>{
try{

const order =
await Order.findById(
req.params.id
);

if(!order){
return res.status(404).json({
message:'Order not found'
});
}

order.paymentStatus='paid';

order.status='paid';

order.paymentVerifiedAt=
new Date();

await order.save();

res.status(200).json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
APPROVE REFUND
============================== */

const approveRefund =
async(req,res)=>{
try{

const order =
await Order.findById(
req.params.id
);

if(!order){
return res.status(404).json({
message:'Order not found'
});
}

order.returnStatus='approved';

order.status='cancelled';

await order.save();

res.status(200).json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}
};


/* ==============================
RESOLVE DISPUTE
============================== */

const resolveDispute =
async(req,res)=>{
try{

const order =
await Order.findById(
req.params.id
);

if(!order){
return res.status(404).json({
message:'Order not found'
});
}

order.disputeStatus =
req.body.status ||
'resolved';

await order.save();

res.status(200).json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}
};



module.exports = {

getAllUsers,
verifySeller,
banUser,

getPayouts,
approvePayout,

getPendingPayments,

verifyManualPayment,
approveRefund,
resolveDispute

};
