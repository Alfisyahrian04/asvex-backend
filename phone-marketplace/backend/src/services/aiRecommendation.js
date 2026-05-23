const Product =
require('../models/Product');

const Order =
require('../models/Order');

exports.getTrendingProducts =
async()=>{

const products =
await Product.find({
isActive:true
})
.sort({
reviewCount:-1,
rating:-1
})
.limit(10);

return products;

};

exports.getRecommendedProducts =
async(userId)=>{

const orders =
await Order.find({
buyer:userId
})
.populate('product');

const categories =
orders.map(
order =>
order.product?.category
);

if(!categories.length){

return await exports
.getTrendingProducts();

}

const recommended =
await Product.find({

category:{
$in:categories
},

isActive:true

})
.limit(10);

return recommended;

};

exports.getRelatedProducts =
async(productId)=>{

const currentProduct =
await Product.findById(
productId
);

if(!currentProduct){

return [];

}

const related =
await Product.find({

category:
currentProduct.category,

_id:{
$ne:productId
},

isActive:true

})
.limit(8);

return related;

};
