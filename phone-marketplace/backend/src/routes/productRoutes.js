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
getWishlist,
getTrending,
getRecommendations,
getRelated
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
'/trending',
getTrending
);

router.get(
'/recommendations',
protect,
getRecommendations
);

router.get(
'/related/:id',
getRelated
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
