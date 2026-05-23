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

productType:{
type:String,
enum:[
'physical',
'digital',
'service'
],
default:'physical'
},

quantity:{
type:Number,
default:1
},

price:{
type:Number,
required:true
},

totalPrice:{
type:Number,
required:true
},

paymentStatus:{
type:String,
enum:[
'pending',
'paid',
'failed',
'refunded'
],
default:'pending'
},

deliveryStatus:{
type:String,
enum:[
'processing',
'shipped',
'delivered',
'completed'
],
default:'processing'
},

escrowStatus:{
type:String,
enum:[
'hold',
'released'
],
default:'hold'
},

trackingNumber:{
type:String,
default:''
},

paymentToken:{
type:String,
default:''
},

paymentUrl:{
type:String,
default:''
},

shippingAddress:{
type:String,
default:''
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

digitalDelivery:{
type:Object,
default:{}
},

serviceProgress:{
type:Object,
default:{}
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Order',
OrderSchema
);
