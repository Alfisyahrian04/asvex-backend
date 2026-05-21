const router =
require('express').Router();

const controller =
require('../controllers/orderController');

const auth =
require('../middleware/authMiddleware');

const idempotency =
require('../middleware/idempotencyMiddleware');

router.post(
  '/',
  auth,
  idempotency,
  controller.createOrder
);

module.exports = router;
