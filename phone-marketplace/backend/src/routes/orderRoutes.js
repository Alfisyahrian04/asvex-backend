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
shipOrder,

/* PATCH */
completeOrder,
cancelOrder,
requestReturn,
submitDispute
/* PATCH */

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

router.put(
'/:id/verify-payment',
protect,
verifyPayment
);

router.put(
'/:id/ship',
protect,
shipOrder
);

/* PATCH START */

router.put(
'/:id/complete',
protect,
completeOrder
);

router.put(
'/:id/cancel',
protect,
cancelOrder
);

router.put(
'/:id/return',
protect,
requestReturn
);

router.put(
'/:id/dispute',
protect,
submitDispute
);

/* PATCH END */

module.exports =
router;
