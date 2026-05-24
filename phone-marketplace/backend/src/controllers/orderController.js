const Product =
require('../models/Product');

const Order =
require('../models/Order');

exports.createOrder =
async(req,res)=>{

try{

const {
productId,
quantity,
shippingAddress,
paymentMethod,
paymentProof,
shippingCourier,
shippingCost,
variant
} = req.body;

if(
!productId ||
!quantity
){
return res.status(400)
.json({
message:
'Data order tidak lengkap'
});
}

const product =
await Product.findById(
productId
);

if(
!product ||
!product.isActive
){
return res.status(404)
.json({
message:
'Produk tidak ditemukan'
});
}

/* PATCH START - variant stock validation */

if(
variant &&
product.variants?.length
){

const selectedVariant =
product.variants.find(
v =>
v._id?.toString()
=== variant._id
);

if(
selectedVariant &&
selectedVariant.stock < quantity
){
return res.status(400)
.json({
message:
'Stock varian tidak cukup'
});
}

}

/* PATCH END */

if(
product.stock < quantity
){
return res.status(400)
.json({
message:
'Stock produk tidak cukup'
});
}

const totalPrice =
(product.price * quantity) +
Number(shippingCost || 0);

const order =
await Order.create({

buyer:req.user._id,
seller:product.seller,
product:product._id,
quantity,
totalPrice,
shippingAddress,

paymentMethod,
paymentProof,
shippingCourier,
shippingCost,
variant,

status:'waiting_verification'

});

product.stock -= quantity;

/* PATCH START - variant stock reduce */

if(
variant &&
product.variants?.length
){

product.variants =
product.variants.map(v=>{

if(
v._id?.toString()
=== variant._id
){

v.stock =
Math.max(
0,
(v.stock || 0) - quantity
);

}

return v;

});

}

/* PATCH END */

await product.save();

res.status(201)
.json(order);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getMyOrders =
async(req,res)=>{

try{

const orders =
await Order.find({
buyer:req.user._id
})
.populate('product')
.populate('seller','username')
.sort({
createdAt:-1
});

res.json(orders);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getSellerOrders =
async(req,res)=>{

try{

const orders =
await Order.find({
seller:req.user._id
})
.populate('product')
.populate('buyer','username')
.sort({
createdAt:-1
});

res.json(orders);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.verifyPayment =
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

order.status='paid';
order.paymentStatus='paid';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.shipOrder =
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

order.trackingNumber =
req.body.trackingNumber || '';

order.shippingPhoto =
req.body.shippingPhoto || '';

order.status='shipped';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.updateOrderStatus =
async(req,res)=>{

try{

const order =
await Order.findById(
req.params.id
);

if(!order){

return res.status(404)
.json({
message:'Order tidak ditemukan'
});

}

if(
order.seller.toString()
!== req.user._id.toString()
){

return res.status(403)
.json({
message:'Forbidden'
});

}

order.status =
req.body.status ||
order.status;

await order.save();

res.json(order);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

/* PATCH START */

exports.completeOrder =
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

order.status='completed';
order.completedAt=new Date();

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.cancelOrder =
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

order.status='cancelled';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.requestReturn =
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

order.returnStatus =
'requested';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.submitDispute =
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

order.disputeStatus =
req.body.reason ||
'pending';

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

/* PATCH END */
