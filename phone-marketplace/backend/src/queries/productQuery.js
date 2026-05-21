const Product =
require('../models/Product');

exports.findProducts =
async ({
  limit = 20,
  skip = 0
}) => {

  return await Product.find()

    .limit(limit)

    .skip(skip);

};
