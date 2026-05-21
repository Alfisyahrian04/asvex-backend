const Product =
require('../models/Product');

exports.reduceStock =
async items => {

  for (const item of items) {

    const product =
      await Product.findById(
        item.productId
      );

    if (!product) {

      throw new Error(
        'Product tidak ditemukan'
      );

    }

    if (
      product.stock <
      item.qty
    ) {

      throw new Error(
        'Stock tidak cukup'
      );

    }

    product.stock -= item.qty;

    product.totalSold += item.qty;

    await product.save();

  }

};
