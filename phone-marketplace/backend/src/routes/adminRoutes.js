const router =
require('express').Router();

const controller =
require('../controllers/adminController');

const auth =
require('../middleware/authMiddleware');

router.get(
  '/dashboard',
  auth,
  controller.dashboard
);

module.exports = router;
