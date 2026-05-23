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

status:{
type:String,
enum:[
'pending',
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
