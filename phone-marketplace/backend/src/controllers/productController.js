const Product =
require('../models/Product');

exports.getProducts =
async (req, res) => {

  const products =
    await Product.find()
    .sort({
      createdAt: -1
    });

  res.json(products);

};

exports.createProduct =
async (req, res) => {

  const product =
    await Product.create({

      ...req.body,

      sellerId:
        req.user._id,

      sellerName:
        req.user.username

    });

  res.json(product);

};
