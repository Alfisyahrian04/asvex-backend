const express =
require('express');

const router =
express.Router();

const {
createProduct,
getProducts,
getSingleProduct,
updateProduct,
deleteProduct,
toggleWishlist,
getWishlist
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
'/wishlist/me',
protect,
getWishlist
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

router.post(
'/wishlist/:id',
protect,
toggleWishlist
);

module.exports =
router;
