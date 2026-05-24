/* PATCH START */

const Order =
require('../models/Order');

exports.verifyManualPayment =
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

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.approveRefund =
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

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.resolveDispute =
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
req.body.status || 'resolved';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

/* PATCH END */
