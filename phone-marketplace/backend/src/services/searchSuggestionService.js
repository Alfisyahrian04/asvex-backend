const Product =
require('../models/Product');

exports.getSuggestions =
async(keyword)=>{

const products =
await Product.find({

name:{
$regex:keyword,
$options:'i'
}

})
.limit(5);

return products.map(
product => product.name
);

};
