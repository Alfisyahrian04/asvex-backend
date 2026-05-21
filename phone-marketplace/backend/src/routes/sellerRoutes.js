const router =
require('express').Router();

const controller =
require('../controllers/sellerController');

const auth =
require('../middleware/authMiddleware');

router.get(
  '/dashboard',
  auth,
  controller.dashboard
);

module.exports = router;
