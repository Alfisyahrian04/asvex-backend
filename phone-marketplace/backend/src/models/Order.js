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

/* BUYER REFUND DATA */

unboxingVideo:{
type:String,
default:''
},

refundBankName:{
type:String,
default:''
},

refundAccountName:{
type:String,
default:''
},

refundAccountNumber:{
type:String,
default:''
},

sellerRefundBankName:{
type:String,
default:''
},

sellerRefundAccountName:{
type:String,
default:''
},

sellerRefundAccountNumber:{
type:String,
default:''
},

/* SELLER RETURN FLOW */

sellerRefundApproved:{
type:Boolean,
default:false
},

returnAddress:{
type:String,
default:''
},

returnReceiverName:{
type:String,
default:''
},

buyerReturnTrackingNumber:{
type:String,
default:''
},

buyerReturnPackagePhoto:{
type:String,
default:''
},

returnProof:{
  type:String,
  default:''
},

sellerReceivedReturnPackage:{
type:Boolean,
default:false
},

sellerReceivedReturnAt:{
type:Date,
default:null
},

/* ADMIN REFUND */

adminRefundTransferProof:{
type:String,
default:''
},

refundTransferredAt:{
type:Date,
default:null
},

refundCompleted:{
type:Boolean,
default:false
},

refundCompletedAt:{
type:Date,
default:null
},

/* SELLER APPEAL */

appealReason:{
type:String,
default:''
},

appealPhoto:{
type:String,
default:''
},

appealVideo:{
type:String,
default:''
},

appealSubmittedAt:{
type:Date,
default:null
},

rejectionReason:{
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

status:{
type:String,
enum:[
'pending',
'pending_payment',
'waiting_confirmation',
'waiting_verification',
'waiting_payment_verification',
'waiting_seller_refund_approval',
'paid',
'rejected',
'processed',
'shipped',
'completed',
'refund_rejected',
'waiting_return',
'waiting_seller_receive_return',
'waiting_admin_refund',
'appeal_submitted',
'refund_completed',
'cancelled',
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
