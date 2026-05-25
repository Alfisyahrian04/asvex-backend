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

receiverName:{
type:String,
default:''
},

receiverPhone:{
type:String,
default:''
},

receiverAddress:{
type:String,
default:''
},

senderBank:{
type:String,
default:''
},

senderName:{
type:String,
default:''
},

adminPaymentMethod:{
type:String,
default:''
},

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

/* REFUND PATCH */

refundRequest:{
type:Boolean,
default:false
},

refundReason:{
type:String,
default:''
},

refundStatus:{
type:String,
default:''
},

refundApprovedAt:{
type:Date,
default:null
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

status:{
type:String,
enum:[
'pending',
'pending_payment',
'waiting_confirmation',
'waiting_verification',
'waiting_payment_verification',
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
