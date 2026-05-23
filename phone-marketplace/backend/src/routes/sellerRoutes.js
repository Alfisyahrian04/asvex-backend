const express =
require('express');

const router =
express.Router();

const {
getWallet,
requestPayout
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

module.exports =
router;
