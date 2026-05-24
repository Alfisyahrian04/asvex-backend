const mongoose =
require('mongoose');

const OrderSchema =
new mongoose.Schema({

buyer:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

seller:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

product:{
type:
mongoose.Schema.Types.ObjectId,
ref:'Product'
},

quantity:{
type:Number,
default:1
},

totalPrice:{
type:Number,
required:true
},

shippingAddress:{
type:String,
default:''
},

paymentMethod:{
type:String,
default:''
},

paymentProof:{
type:String,
default:''
},

trackingNumber:{
type:String,
default:''
},

shippingCourier:{
type:String,
default:''
},

shippingCost:{
type:Number,
default:0
},

variant:{
color:{
type:String,
default:''
},
storage:{
type:String,
default:''
}
},

/* PATCH START */

paymentStatus:{
type:String,
default:'pending'
},

paymentVerifiedAt:{
type:Date
},

shippingPhoto:{
type:String,
default:''
},

completedAt:{
type:Date
},

complaintStatus:{
type:String,
default:''
},

returnStatus:{
type:String,
default:''
},

disputeStatus:{
type:String,
default:''
},

fundStatus:{
type:String,
default:'hold'
},

timeline:[
{
title:String,
description:String,
createdAt:{
type:Date,
default:Date.now
}
}
],

/* PATCH END */

status:{
type:String,
enum:[
'pending',
'waiting_verification',
'paid',
'processed',
'shipped',
'completed',
'cancelled'
],
default:'pending'
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Order',
OrderSchema
);
