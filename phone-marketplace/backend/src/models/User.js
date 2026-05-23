const mongoose =
require('mongoose');

const UserSchema =
new mongoose.Schema({

username:{
type:String,
required:true,
unique:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

role:{
type:String,
enum:[
'buyer',
'seller',
'customer_service',
'admin'
],
default:'buyer'
},

avatar:{
type:String,
default:''
},

phone:{
type:String,
default:''
},

address:{
type:String,
default:''
},

walletBalance:{
type:Number,
default:0
},

verificationStatus:{
type:Boolean,
default:false
},

isBanned:{
type:Boolean,
default:false
},

wishlist:[
{
type:
mongoose.Schema.Types.ObjectId,
ref:'Product'
}
]

},{
timestamps:true
});

module.exports =
mongoose.model(
'User',
UserSchema
);
