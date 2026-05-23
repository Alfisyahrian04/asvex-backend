const Order =
require('../models/Order');

const Product =
require('../models/Product');

exports.createOrder =
async(req,res)=>{

try{

const {
productId,
quantity,
shippingAddress
} = req.body;

const product =
await Product.findById(
productId
);

if(!product){

return res.status(404)
.json({
message:
'Product not found'
});

}

const totalPrice =
product.price * quantity;

const order =
await Order.create({

buyer:req.user._id,

seller:product.seller,

product:product._id,

productType:
product.productType,

quantity,

price:product.price,

totalPrice,

shippingAddress,

paymentStatus:'pending',

timeline:[
{
title:'Order Created',
description:
'Buyer created order'
}
]

});

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
.populate(
'product'
)
.populate(
'seller',
'username'
)
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

exports.updateOrderStatus =
async(req,res)=>{

try{

const {
paymentStatus,
deliveryStatus
} = req.body;

const order =
await Order.findById(
req.params.id
);

if(!order){

return res.status(404)
.json({
message:
'Order not found'
});

}

if(paymentStatus){

order.paymentStatus =
paymentStatus;

}

if(deliveryStatus){

order.deliveryStatus =
deliveryStatus;

}

order.timeline.push({

title:'Order Updated',

description:
'Order status updated'

});

await order.save();

res.json(order);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
