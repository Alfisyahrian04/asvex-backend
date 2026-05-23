const FlashSale =
require('../models/FlashSale');

exports.getFlashSales =
async(req,res)=>{

try{

const now =
new Date();

const sales =
await FlashSale.find({

isActive:true,

startDate:{
$lte:now
},

endDate:{
$gte:now
}

}).populate(
'product'
);

res.json(sales);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
