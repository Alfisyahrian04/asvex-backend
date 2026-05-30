const User =
require('../models/User');

const Order =
require('../models/Order');

const Product = require('../models/Product');


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

user.updatedAt =
new Date();

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

user.updatedAt =
new Date();

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
============================== */

const getPendingPayments =
async(req,res)=>{
try{

const orders =
await Order.find()
.populate(
'buyer',
'username email'
)
.populate(
'product'
)
.sort({
createdAt:-1
});

const filteredOrders =
orders.filter(order=>{

const paymentStatus =
String(
order.paymentStatus || ''
)
.toLowerCase()
.trim();

const status =
String(
order.status || ''
)
.toLowerCase()
.trim();

return [

'waiting_verification',
'pending',
'unpaid'

].includes(paymentStatus)

||

[
'waiting_verification',
'waiting_confirmation',
'waiting_payment_verification',
'pending_payment',
'waiting_admin_confirmation',
'awaiting_confirmation',
'pending',
'waiting_payment',
'menunggu_konfirmasi_admin'

].includes(status);

});

res.status(200).json({
success:true,
total:filteredOrders.length,
orders:filteredOrders
});

}catch(error){

console.log(
'GET PENDING PAYMENTS ERROR:',
error
);

res.status(500).json({
message:error.message
});

}
};


/* ==============================
GET REFUND REQUESTS
============================== */

const getRefundRequests =
async(req,res)=>{
try{

const orders =
await Order.find({
  $or:[
    {
      refundRequest:true
    },
    {
      status:'appeal_submitted'
    },
    {
      refundCompleted:true
    },
    {
      refundStatus:'refund_completed'
    },
    {
      status:'refund_completed'
    }
  ]
})
.populate('buyer','username')
.populate('seller','username storeName')
.populate('product')
.sort({ createdAt:-1 });
  
console.log(
  'REFUND ORDER DEBUG:',
  JSON.stringify(orders[0], null, 2)
);
  
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

order.payoutPaidAt =
new Date();

order.updatedAt =
new Date();

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
REJECT PAYMENT
============================== */

const rejectPayment =
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

order.paymentStatus = 'rejected';

order.status = 'rejected';

if(order.product){
  const product = await Product.findById(order.product);

  if(product){
    product.stock += order.quantity || 1;
    await product.save();
  }
}

order.rejectionReason =
req.body.rejectionReason || '';

order.updatedAt =
new Date();

await order.save();

res.status(200).json({
success:true,
message:'Payment rejected',
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

order.updatedAt =
new Date();

await order.save();

res.status(200).json({
success:true,
message:'Payment verified successfully',
order
});

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

order.adminRefundTransferProof =
  req.body.refundTransferProof || '';

order.refundCompleted = true;
order.refundRequest = false;

order.refundCompletedAt =
  new Date();

order.refundTransferredAt =
  new Date();

order.returnStatus =
  'refund_completed';

order.refundStatus =
  'refund_completed';

order.status =
  'refund_completed';

order.refundApprovedAt =
new Date();

order.updatedAt =
new Date();

if(order.product){
  const product = await Product.findById(order.product);

  if(product){
    product.stock += order.quantity || 1;
    await product.save();
  }
}
  
await order.save();

res.status(200).json({
success:true,
message:'Refund approved',
order
});

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

order.disputeResolvedAt =
new Date();

order.updatedAt =
new Date();

await order.save();

res.status(200).json({
success:true,
message:'Dispute resolved',
order
});

}catch(error){

res.status(500).json({
message:error.message
});

}
};

/* ==============================
APPROVE SELLER APPEAL
============================== */

const approveSellerAppeal =
async(req,res)=>{
try{

const order =
await Order.findById(req.params.id);

if(!order){
return res.status(404).json({
message:'Order not found'
});
}

order.refundStatus = 'appeal_accepted';
order.returnStatus = 'appeal_accepted';
order.status = 'cancelled';

/* buyer refund ditolak */
order.refundRequest = false;

await order.save();

res.status(200).json({
success:true,
message:'Banding seller diterima',
order
});

}catch(error){
res.status(500).json({
message:error.message
});
}
};


/* ==============================
REJECT SELLER APPEAL
============================== */

const rejectSellerAppeal =
async(req,res)=>{
try{

const order =
await Order.findById(req.params.id);

if(!order){
return res.status(404).json({
message:'Order not found'
});
}

order.adminRejectAppealReason =
req.body.reason || '';

order.refundStatus = 'appeal_rejected';
order.returnStatus = 'appeal_rejected';

/* lanjut refund buyer */
order.status = 'waiting_admin_refund';

await order.save();

res.status(200).json({
success:true,
message:'Banding seller ditolak',
order
});

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
getRefundRequests,

verifyManualPayment,
rejectPayment,
approveRefund,
resolveDispute,

approveSellerAppeal,
rejectSellerAppeal,

};
