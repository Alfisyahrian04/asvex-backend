const express =
require('express');

const router =
express.Router();

const {
createProduct,
getProducts,
getSingleProduct,
toggleWishlist,
getWishlist,
deleteProduct,
updateProduct,
getMyProducts
} = require(
'../controllers/productController'
);

const {
protect,
roleMiddleware
} = require(
'../middleware/authMiddleware'
);

/* PUBLIC */

router.get(
'/',
getProducts
);

router.get(
'/wishlist/me',
protect,
getWishlist
);

/* SELLER PRODUCTS */

router.get(
'/my-products',
protect,
getMyProducts
);

router.post(
'/',
protect,
roleMiddleware(
'seller',
'admin'
),
createProduct
);

router.put(
'/:id',
protect,
roleMiddleware(
'seller',
'admin'
),
updateProduct
);

router.delete(
'/:id',
protect,
roleMiddleware(
'seller',
'admin'
),
deleteProduct
);

/* WISHLIST */

router.post(
'/wishlist/:id',
protect,
toggleWishlist
);

/* SINGLE PRODUCT */

router.get(
'/:id',
getSingleProduct
);

module.exports =
router;
