const Product =
require('../models/Product');

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
