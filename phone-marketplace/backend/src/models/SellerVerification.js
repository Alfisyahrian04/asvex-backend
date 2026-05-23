const mongoose =
require('mongoose');

const SellerVerificationSchema =
new mongoose.Schema({

seller:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

ktpImage:{
type:String
},

selfieImage:{
type:String
},

storePhoto:{
type:String
},

status:{
type:String,
enum:[
'pending',
'approved',
'rejected'
],
default:'pending'
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'SellerVerification',
SellerVerificationSchema
);
