const Product =
require('../models/Product');

exports.reduceStock =
async(productId,quantity)=>{

const product =
await Product.findById(
productId
);

if(!product){

throw new Error(
'Product not found'
);

}

if(product.stock < quantity){

throw new Error(
'Insufficient stock'
);

}

product.stock -= quantity;

await product.save();

return product;

};

exports.restoreStock =
async(productId,quantity)=>{

const product =
await Product.findById(
productId
);

if(!product){

throw new Error(
'Product not found'
);

}

product.stock += quantity;

await product.save();

return product;

};

exports.checkLowStock =
(product)=>{

return product.stock <= 5;

};
