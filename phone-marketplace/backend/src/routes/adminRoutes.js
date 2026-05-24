const express =
require('express');

const router =
express.Router();

const {
getAllUsers,
verifySeller,
banUser,
getPayouts,
approvePayout,

/* PATCH */
verifyManualPayment,
approveRefund,
resolveDispute
/* PATCH */

} = require(
'../controllers/adminController'
);

const {
protect,
roleMiddleware
} = require(
'../middleware/authMiddleware'
);

router.use(
protect
);

router.use(
roleMiddleware('admin')
);

router.get(
'/users',
getAllUsers
);

router.put(
'/verify-seller/:id',
verifySeller
);

router.put(
'/ban-user/:id',
banUser
);

router.get(
'/payouts',
getPayouts
);

router.put(
'/approve-payout/:id',
approvePayout
);

/* PATCH START */

router.put(
'/verify-payment/:id',
verifyManualPayment
);

router.put(
'/approve-refund/:id',
approveRefund
);

router.put(
'/resolve-dispute/:id',
resolveDispute
);

/* PATCH END */

module.exports =
router;
