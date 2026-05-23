const mongoose =
require('mongoose');

const WalletTransactionSchema =
new mongoose.Schema({

user:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

type:{
type:String,
enum:[
'income',
'withdraw',
'refund'
]
},

amount:{
type:Number,
required:true
},

description:{
type:String,
default:''
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'WalletTransaction',
WalletTransactionSchema
);
