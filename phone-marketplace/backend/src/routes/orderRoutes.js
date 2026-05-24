const express =
require('express');

const router =
express.Router();

const {
createOrder,
getMyOrders,
getSellerOrders,
updateOrderStatus,
verifyPayment,
shipOrder
} = require(
'../controllers/orderController'
);

const {
protect
} = require(
'../middleware/authMiddleware'
);

router.post(
'/',
protect,
createOrder
);

router.get(
'/my-orders',
protect,
getMyOrders
);

/* SELLER */

router.get(
'/seller-orders',
protect,
getSellerOrders
);

router.put(
'/:id/status',
protect,
updateOrderStatus
);

/* PATCH ADMIN PAYMENT VERIFY */

router.put(
'/:id/verify-payment',
protect,
verifyPayment
);

/* PATCH SHIPPING */

router.put(
'/:id/ship',
protect,
shipOrder
);

module.exports =
router;
