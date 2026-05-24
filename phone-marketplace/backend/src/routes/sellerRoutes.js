const express =
require('express');

const router =
express.Router();

const {
getWallet,
requestPayout,
getSellerProducts,
getSellerAnalytics,

/* PATCH */
updateSellerProfile,
uploadShippingData
/* PATCH */

} = require(
'../controllers/sellerController'
);

const {
protect
} = require(
'../middleware/authMiddleware'
);

router.get(
'/wallet',
protect,
getWallet
);

router.post(
'/payout',
protect,
requestPayout
);

router.get(
'/products',
protect,
getSellerProducts
);

router.get(
'/analytics',
protect,
getSellerAnalytics
);

/* PATCH START */

router.put(
'/profile',
protect,
updateSellerProfile
);

router.put(
'/shipping/:id',
protect,
uploadShippingData
);

/* PATCH END */

module.exports =
router;
