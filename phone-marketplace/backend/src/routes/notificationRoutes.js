const router =
require('express').Router();

const controller =
require('../controllers/notificationController');

const auth =
require('../middleware/authMiddleware');

router.get(
  '/',
  auth,
  controller.getNotifications
);

module.exports = router;
