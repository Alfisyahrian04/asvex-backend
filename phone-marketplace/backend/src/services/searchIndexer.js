const client =
require('../config/search');

exports.indexProduct =
async product => {

  await client
    .index('products')
    .addDocuments([
      product
    ]);

};
