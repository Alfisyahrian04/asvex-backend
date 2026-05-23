const mongoose =
require('mongoose');

const FlashSaleSchema =
new mongoose.Schema({

title:{
type:String,
required:true
},

product:{
type:
mongoose.Schema.Types.ObjectId,
ref:'Product'
},

discountPercent:{
type:Number,
required:true
},

startDate:{
type:Date,
required:true
},

endDate:{
type:Date,
required:true
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
'FlashSale',
FlashSaleSchema
);
