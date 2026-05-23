const Wallet =
require('../models/Wallet');

const Payout =
require('../models/Payout');

const Product =
require('../models/Product');

const Order =
require('../models/Order');

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
message:
'Saldo tidak cukup'
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
