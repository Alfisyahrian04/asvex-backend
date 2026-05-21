const router =
require('express').Router();

const controller =
require('../controllers/reviewController');

const auth =
require('../middleware/authMiddleware');

router.post(
  '/',
  auth,
  controller.createReview
);

module.exports = router;
