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

submitPayment,

completeOrder,
cancelOrder,
requestReturn,
submitDispute

} = require(
'../controllers/orderController'
);

const {
protect
} = require(
'../middleware/authMiddleware'
);


/* CREATE ORDER */

router.post(
'/',
protect,
createOrder
);


/* BUYER */

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


/* PAYMENT SUBMIT */

router.put(
'/:id/payment',
protect,
submitPayment
);


/* ADMIN VERIFY PAYMENT */

router.put(
'/:id/verify-payment',
protect,
verifyPayment
);


/* SHIPPING */

router.put(
'/:id/ship',
protect,
shipOrder
);


/* COMPLETE */

router.put(
'/:id/complete',
protect,
completeOrder
);


/* CANCEL */

router.put(
'/:id/cancel',
protect,
cancelOrder
);


/* RETURN */

router.put(
  '/:id/return',
  protect,
  requestReturn
);

router.put(
  '/:id/refund',
  protect,
  requestReturn
);


/* DISPUTE */

router.put(
'/:id/dispute',
protect,
submitDispute
);


module.exports =
router;
