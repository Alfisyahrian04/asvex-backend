const Wallet =
require('../models/Wallet');

const Payout =
require('../models/Payout');

const Product =
require('../models/Product');

const Order =
require('../models/Order');

const User =
require('../models/User');

exports.getWallet =
async(req,res)=>{

try{

let wallet =
await Wallet.findOne({
user:req.user._id
});

if(!wallet){

wallet =
await Wallet.create({
user:req.user._id
});

}

res.json(wallet);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.requestPayout =
async(req,res)=>{

try{

const {
amount
} = req.body;

const wallet =
await Wallet.findOne({
user:req.user._id
});

if(
!wallet ||
wallet.balance < amount
){

return res.status(400)
.json({
message:'Saldo tidak cukup'
});

}

wallet.balance -= amount;

await wallet.save();

const payout =
await Payout.create({
seller:req.user._id,
amount
});

res.status(201)
.json(payout);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getSellerProducts =
async(req,res)=>{

try{

const products =
await Product.find({
seller:req.user._id
})
.sort({
createdAt:-1
});

res.json(products);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getSellerAnalytics =
async(req,res)=>{

try{

const totalProducts =
await Product.countDocuments({
seller:req.user._id
});

const totalOrders =
await Order.countDocuments({
seller:req.user._id
});

const completedOrders =
await Order.find({
seller:req.user._id,
paymentStatus:'paid'
});

const revenue =
completedOrders.reduce(
(total,item)=>
total + item.totalPrice,
0
);

res.json({
totalProducts,
totalOrders,
revenue
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.updateSellerProfile =
async(req,res)=>{

try{

const user =
await User.findById(
req.user._id
);

if(!user){
return res.status(404).json({
message:'User not found'
});
}

user.storeName =
req.body.storeName ??
user.storeName;

user.phone =
req.body.phone ??
user.phone;

user.returnAddress =
req.body.returnAddress ??
user.returnAddress;

await user.save();

res.json(user);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.uploadShippingData =
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

order.shippingCourier =
req.body.shippingCourier
|| order.shippingCourier;

order.trackingNumber =
req.body.trackingNumber
|| order.trackingNumber;

order.shippingPhoto =
req.body.shippingPhoto
|| order.shippingPhoto;

order.status='shipped';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};


/* REFUND FLOW PATCH */

exports.getSellerRefundRequests =
async(req,res)=>{

try{

const orders =
await Order.find({
seller:req.user._id,
refundRequest:true
})
.populate('buyer')
.populate('product')
.sort({
createdAt:-1
});

res.json({
orders
});

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.rejectRefundRequest =
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

order.refundRequest = false;

order.refundStatus = 'refund_rejected';
order.returnStatus = 'refund_rejected';
order.status = 'refund_rejected';

order.refundRejectedBySeller = true;

order.rejectReason =
req.body.rejectReason || '';

order.sellerRefundBankName =
req.body.bankName || '';

order.sellerRefundAccountName =
req.body.accountName || '';

order.sellerRefundAccountNumber =
req.body.accountNumber || '';

order.refundRejectedAt =
new Date();

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.approveRefundRequest =
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

const seller =
await User.findById(
req.user._id
);

order.sellerRefundApproved = true;

order.refundStatus = 'approved';

/* PATCH STATUS BUYER */
order.status = 'waiting_return';

order.returnStatus = 'approved';

order.returnAddress =
req.body.returnAddress ||
seller.returnAddress ||
'';

order.returnReceiverName =
seller.storeName ||
seller.username ||
'';

order.refundApprovedAt =
new Date();

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.confirmReturnPackageReceived =
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

order.sellerReceivedReturnPackage =
true;

order.returnStatus =
'returned_received';

order.refundStatus =
'waiting_admin_refund';

order.status =
'waiting_admin_refund';

order.sellerReceivedReturnAt =
new Date();

await order.save();

res.json(order);

}
catch(error){

  console.error(
    'SUBMIT REFUND APPEAL ERROR:',
    error
  );

  res.status(500).json({
    message:error.message,
    stack:error.stack
  });

}

};

exports.submitRefundAppeal =
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

const {
  reason,
  appealReason,
  appealPhoto,
  appealVideo
} = req.body;

order.appealReason =
  appealReason || reason || '';

order.appealPhoto =
appealPhoto || '';

order.appealVideo =
appealVideo || '';

/* PATCH */
order.refundRequest = true;

order.returnStatus =
'appealed';

order.refundStatus =
'appealed';

order.status =
'appeal_submitted';

order.appealSubmittedAt =
new Date();

await order.save();

const updatedOrder =
await Order.findById(
req.params.id
);

res.json(updatedOrder);

}catch(error){

res.status(500).json({
message:error.message
});

}
};

exports.requestAppealPayout =
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

    order.payoutRequest = true;

    order.payoutBankName =
      req.body.bankName;

    order.payoutAccountName =
      req.body.accountName;

    order.payoutAccountNumber =
      req.body.accountNumber;

    await order.save();

    res.json({
      success:true,
      message:'Pencairan diajukan'
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};
