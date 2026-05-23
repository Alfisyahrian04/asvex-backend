const express =
require('express');

const router =
express.Router();

const {
getWallet,
requestPayout,
getSellerProducts,
getSellerAnalytics
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

module.exports =
router;
