const express =
require('express');

const router =
express.Router();

const {
createOrder,
getMyOrders,
getSellerOrders,
updateOrderStatus
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

module.exports =
router;
