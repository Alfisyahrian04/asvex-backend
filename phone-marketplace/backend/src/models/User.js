const mongoose =
require('mongoose');

/* PATCH */
const AddressSchema =
new mongoose.Schema({

label:{
type:String,
default:'Rumah'
},

receiverName:{
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

city:{
type:String,
default:''
},

province:{
type:String,
default:''
},

postalCode:{
type:String,
default:''
},

isDefault:{
type:Boolean,
default:false
}

},{ _id:true });

const UserSchema =
new mongoose.Schema({

username:{
type:String,
required:true,
unique:true
},

fullName:{
type:String,
default:''
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

addresses:{
type:[AddressSchema],
default:[]
},

defaultAddressId:{
type:String,
default:''
},

storeName:{
type:String,
default:''
},

returnAddress:{
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

/* PATCH START */
isVerifiedSeller:{
type:Boolean,
default:false
},
/* PATCH END */

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
