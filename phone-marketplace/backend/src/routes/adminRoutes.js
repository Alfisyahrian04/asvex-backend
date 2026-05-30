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

verifyManualPayment,
approveRefund,
resolveDispute,
approveSellerAppeal,
rejectSellerAppeal,

getPendingPayments,
getRefundRequests,

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


/* USERS */

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


/* PAYOUT */

router.get(
'/payouts',
getPayouts
);

router.put(
'/approve-payout/:id',
approvePayout
);

router.put(
'/orders/:id/reject',
protect,
rejectPayment
);

/* PAYMENT */

router.get(
'/pending-payments',
getPendingPayments
);

router.put(
'/verify-payment/:id',
verifyManualPayment
);


/* REFUND */

router.get(
'/refund-requests',
getRefundRequests
);

router.put(
'/approve-refund/:id',
approveRefund
);

router.put(
'/appeal/:id/approve',
approveSellerAppeal
);

router.put(
'/appeal/:id/reject',
rejectSellerAppeal
);

/* DISPUTE */

router.put(
'/resolve-dispute/:id',
resolveDispute
);


module.exports =
router;
