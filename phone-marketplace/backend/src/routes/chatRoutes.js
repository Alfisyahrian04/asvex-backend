const router =
require('express').Router();

const controller =
require('../controllers/chatController');

const auth =
require('../middleware/authMiddleware');

router.post(
  '/',
  auth,
  controller.sendMessage
);

router.get(
  '/:roomId',
  auth,
  controller.getChats
);

module.exports = router;
