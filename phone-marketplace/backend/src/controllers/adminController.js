const User =
require('../models/User');

const Payout =
require('../models/Payout');

const AuditLog =
require('../models/AuditLog');

exports.getAllUsers =
async(req,res)=>{

try{

const users =
await User.find()
.select('-password');

res.json(users);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.verifySeller =
async(req,res)=>{

try{

const seller =
await User.findById(
req.params.id
);

if(!seller){

return res.status(404)
.json({
message:
'Seller not found'
});

}

seller.verificationStatus =
true;

await seller.save();

await AuditLog.create({

admin:req.user._id,

targetUser:seller._id,

action:'VERIFY_SELLER',

description:
'Admin verified seller'

});

res.json({
message:
'Seller verified'
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.banUser =
async(req,res)=>{

try{

const user =
await User.findById(
req.params.id
);

if(!user){

return res.status(404)
.json({
message:
'User not found'
});

}

user.isBanned = true;

await user.save();

await AuditLog.create({

admin:req.user._id,

targetUser:user._id,

action:'BAN_USER',

description:
'Admin banned user'

});

res.json({
message:
'User banned'
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getPayouts =
async(req,res)=>{

try{

const payouts =
await Payout.find()
.populate(
'seller',
'username'
)
.sort({
createdAt:-1
});

res.json(payouts);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.approvePayout =
async(req,res)=>{

try{

const payout =
await Payout.findById(
req.params.id
);

if(!payout){

return res.status(404)
.json({
message:
'Payout not found'
});

}

payout.status =
'approved';

await payout.save();

res.json({
message:
'Payout approved'
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
