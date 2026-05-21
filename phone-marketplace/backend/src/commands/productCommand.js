const Product =
require('../models/Product');

exports.createProduct =
async payload => {

  return await Product.create(
    payload
  );

};
