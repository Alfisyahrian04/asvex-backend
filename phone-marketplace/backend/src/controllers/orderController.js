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

/* PATCH */
paymentMethod,
paymentProof,
shippingCourier,
shippingCost,
variant,
/* PATCH */

status:'waiting_verification'

});

product.stock -= quantity;
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

/* SELLER ORDERS */

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

/* PATCH ADMIN VERIFY PAYMENT */

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

await order.save();

res.json(order);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

/* PATCH SELLER INPUT RESI */

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
message:
'Order tidak ditemukan'
});

}

if(
order.seller.toString()
!== req.user._id.toString()
){

return res.status(403)
.json({
message:
'Forbidden'
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
