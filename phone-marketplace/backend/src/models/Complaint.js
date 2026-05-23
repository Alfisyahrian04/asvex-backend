const mongoose =
require('mongoose');

const ComplaintSchema =
new mongoose.Schema({

order:{
type:
mongoose.Schema.Types.ObjectId,
ref:'Order'
},

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

reason:{
type:String,
required:true
},

evidence:[
{
type:String
}
],

status:{
type:String,
enum:[
'pending',
'processing',
'resolved',
'rejected'
],
default:'pending'
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Complaint',
ComplaintSchema
);
