const express =
require('express');

const router =
express.Router();

const {
createProduct,
getProducts,
getSingleProduct,
updateProduct,
deleteProduct
} = require(
'../controllers/productController'
);

const {
protect
} = require(
'../middleware/authMiddleware'
);

router.get(
'/',
getProducts
);

router.get(
'/:id',
getSingleProduct
);

router.post(
'/',
protect,
createProduct
);

router.put(
'/:id',
protect,
updateProduct
);

router.delete(
'/:id',
protect,
deleteProduct
);

module.exports =
router;
