const express =
require('express');

const router =
express.Router();

const {
getAllUsers,
verifySeller,
banUser,
getPayouts,
approvePayout
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

module.exports =
router;
