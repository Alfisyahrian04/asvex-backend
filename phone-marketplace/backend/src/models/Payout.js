const mongoose =
require('mongoose');

const PayoutSchema =
new mongoose.Schema({

seller:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

amount:{
type:Number,
required:true
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
'Payout',
PayoutSchema
);
