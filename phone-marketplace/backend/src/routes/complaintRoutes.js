const express =
require('express');

const router =
express.Router();

const {
createComplaint,
createTicket,
getComplaints,
updateComplaintStatus
} = require(
'../controllers/complaintController'
);

const {
protect,
roleMiddleware
} = require(
'../middleware/authMiddleware'
);

router.post(
'/',
protect,
createComplaint
);

router.post(
'/ticket',
protect,
createTicket
);

router.get(
'/',
protect,
roleMiddleware(
'admin',
'customer_service'
),
getComplaints
);

router.put(
'/:id',
protect,
roleMiddleware(
'admin',
'customer_service'
),
updateComplaintStatus
);

module.exports =
router;
