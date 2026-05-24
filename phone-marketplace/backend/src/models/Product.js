const mongoose =
require('mongoose');

const ProductSchema =
new mongoose.Schema({

name:{
type:String,
required:true
},

slug:{
type:String,
unique:true
},

description:{
type:String,
default:''
},

price:{
type:Number,
required:true
},

stock:{
type:Number,
default:0
},

/* PATCH */
sold:{
type:Number,
default:0
},
/* PATCH END */

category:{
type:String,
required:true
},

brand:{
type:String,
default:''
},

/* PATCH START */
condition:{
type:String,
default:'Baru'
},

weight:{
type:Number,
default:0
},

sku:{
type:String,
default:''
},

mainVariant:{
type:String,
default:''
},
/* PATCH END */

productType:{
type:String,
enum:[
'physical',
'digital',
'service'
],
default:'physical'
},

images:[
{
type:String
}
],

specifications:{
type:Object,
default:{}
},

variants:[
{

name:String,

value:String,

price:Number,

stock:Number,

/* PATCH START */
image:{
type:String,
default:''
},

color:String,

storage:String,

ram:String,

rom:String,

specs:String
/* PATCH END */

}
],

seller:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

rating:{
type:Number,
default:0
},

reviewCount:{
type:Number,
default:0
},

isActive:{
type:Boolean,
default:true
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Product',
ProductSchema
);
