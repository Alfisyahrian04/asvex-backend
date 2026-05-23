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
product.price * quantity;

const order =
await Order.create({

buyer:req.user._id,

seller:product.seller,

product:product._id,

quantity,

totalPrice,

shippingAddress,

status:'pending'

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

res.json(
orders
);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
