const express =
require('express');

const router =
express.Router();

const {

getWallet,
requestPayout,
getSellerProducts,
getSellerAnalytics,

updateSellerProfile,
uploadShippingData,

/* REFUND PATCH */
getSellerRefundRequests,
approveRefundRequest,
rejectRefundRequest,
confirmReturnPackageReceived,
submitRefundAppeal,
requestAppealPayout,

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


/* REFUND FLOW */

router.get(
'/refund-requests',
protect,
getSellerRefundRequests
);

router.put(
'/refund/:id/approve',
protect,
approveRefundRequest
);

router.put(
'/refund/:id/reject',
protect,
rejectRefundRequest
);

router.put(
'/refund/:id/return-received',
protect,
confirmReturnPackageReceived
);

router.put(
'/refund/:id/appeal',
protect,
submitRefundAppeal
);

router.put(
'/appeal-payout/:id',
protect,
requestAppealPayout
);

module.exports = router;
