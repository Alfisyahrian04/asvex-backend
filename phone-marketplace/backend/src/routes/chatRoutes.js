const express =
require('express');

const router =
express.Router();

const {
sendMessage,
getMessages
} = require(
'../controllers/chatController'
);

const {
protect
} = require(
'../middleware/authMiddleware'
);

router.post(
'/',
protect,
sendMessage
);

router.get(
'/:receiverId',
protect,
getMessages
);

module.exports =
router;
