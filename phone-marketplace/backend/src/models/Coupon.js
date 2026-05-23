const mongoose =
require('mongoose');

const CouponSchema =
new mongoose.Schema({

code:{
type:String,
unique:true
},

discountType:{
type:String,
enum:[
'percent',
'fixed'
]
},

discountValue:{
type:Number
},

minimumPurchase:{
type:Number,
default:0
},

expiredAt:{
type:Date
},

isActive:{
type:Boolean,
default:true
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Coupon',
CouponSchema
);
