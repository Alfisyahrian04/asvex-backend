const Review =
require('../models/Review');

const Product =
require('../models/Product');

const Order =
require('../models/Order');

exports.createReview =
async(req,res)=>{

try{

const {
productId,
rating,
comment
} = req.body;

const product =
await Product.findById(
productId
);

if(!product){

return res.status(404)
.json({
message:
'Product not found'
});

}

const purchased =
await Order.findOne({

buyer:req.user._id,

product:productId,

paymentStatus:'paid'

});

if(!purchased){

return res.status(403)
.json({
message:
'Buy product first'
});

}

const existingReview =
await Review.findOne({

user:req.user._id,

product:productId

});

if(existingReview){

return res.status(400)
.json({
message:
'Already reviewed'
});

}

const review =
await Review.create({

product:productId,

user:req.user._id,

rating,
comment,

verifiedPurchase:true

});

const reviews =
await Review.find({
product:productId
});

const totalRating =
reviews.reduce(
(total,item)=>
total + item.rating,
0
);

product.rating =
(
totalRating /
reviews.length
).toFixed(1);

product.reviewCount =
reviews.length;

await product.save();

res.status(201)
.json(review);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getProductReviews =
async(req,res)=>{

try{

const reviews =
await Review.find({

product:req.params.productId

})
.populate(
'user',
'username'
)
.sort({
createdAt:-1
});

res.json(reviews);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
