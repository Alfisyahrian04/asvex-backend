const Product =
require('../models/Product');

const User =
require('../models/User');

const {
getTrendingProducts,
getRecommendedProducts,
getRelatedProducts
} = require(
'../services/aiRecommendation'
);

exports.createProduct =
async(req,res)=>{

try{

const product =
await Product.create({

...req.body,
seller:req.user._id

});

res.status(201)
.json(product);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getProducts =
async(req,res)=>{

try{

const products =
await Product.find({
isActive:true
})
.populate(
'seller',
'username'
)
.sort({
createdAt:-1
});

res.json(products);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getSingleProduct =
async(req,res)=>{

try{

const product =
await Product.findById(
req.params.id
).populate(
'seller',
'username'
);

if(!product){

return res.status(404)
.json({
message:
'Product not found'
});

}

res.json(product);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.updateProduct =
async(req,res)=>{

try{

const product =
await Product.findById(
req.params.id
);

if(!product){

return res.status(404)
.json({
message:
'Product not found'
});

}

if(
product.seller.toString()
!== req.user._id.toString()
){

return res.status(403)
.json({
message:
'Forbidden'
});

}

const updatedProduct =
await Product.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true
}

);

res.json(updatedProduct);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.deleteProduct =
async(req,res)=>{

try{

const product =
await Product.findById(
req.params.id
);

if(!product){

return res.status(404)
.json({
message:
'Product not found'
});

}

if(
product.seller.toString()
!== req.user._id.toString()
){

return res.status(403)
.json({
message:
'Forbidden'
});

}

product.isActive = false;

await product.save();

res.json({
message:
'Product deleted'
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.searchProducts =
async(req,res)=>{

try{

const {
keyword,
category,
minPrice,
maxPrice,
sort
} = req.query;

let query = {
isActive:true
};

if(keyword){

query.name = {
$regex:keyword,
$options:'i'
};

}

if(category){

query.category =
category;

}

if(
minPrice ||
maxPrice
){

query.price = {};

if(minPrice){

query.price.$gte =
Number(minPrice);

}

if(maxPrice){

query.price.$lte =
Number(maxPrice);

}

}

let productsQuery =
Product.find(query)
.populate(
'seller',
'username'
);

if(sort === 'low'){

productsQuery =
productsQuery.sort({
price:1
});

}

if(sort === 'high'){

productsQuery =
productsQuery.sort({
price:-1
});

}

if(sort === 'latest'){

productsQuery =
productsQuery.sort({
createdAt:-1
});

}

const products =
await productsQuery;

res.json(products);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.toggleWishlist =
async(req,res)=>{

try{

const user =
await User.findById(
req.user._id
);

const productId =
req.params.id;

const exists =
user.wishlist.includes(
productId
);

if(exists){

user.wishlist =
user.wishlist.filter(
item =>
item.toString() !==
productId
);

}else{

user.wishlist.push(
productId
);

}

await user.save();

res.json({
wishlist:user.wishlist
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getWishlist =
async(req,res)=>{

try{

const user =
await User.findById(
req.user._id
).populate(
'wishlist'
);

res.json(
user.wishlist
);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getTrending =
async(req,res)=>{

try{

const products =
await getTrendingProducts();

res.json(products);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getRecommendations =
async(req,res)=>{

try{

const products =
await getRecommendedProducts(
req.user._id
);

res.json(products);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getRelated =
async(req,res)=>{

try{

const products =
await getRelatedProducts(
req.params.id
);

res.json(products);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
