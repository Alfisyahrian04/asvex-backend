const Complaint =
require('../models/Complaint');

const Ticket =
require('../models/Ticket');

const Order =
require('../models/Order');

exports.createComplaint =
async(req,res)=>{

try{

const {
orderId,
reason,
evidence
} = req.body;

const order =
await Order.findById(
orderId
);

if(!order){

return res.status(404)
.json({
message:
'Order not found'
});

}

const complaint =
await Complaint.create({

order:order._id,

buyer:req.user._id,

seller:order.seller,

reason,

evidence

});

res.status(201)
.json(complaint);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.createTicket =
async(req,res)=>{

try{

const {
title,
message
} = req.body;

const ticket =
await Ticket.create({

user:req.user._id,

title,
message

});

res.status(201)
.json(ticket);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getComplaints =
async(req,res)=>{

try{

const complaints =
await Complaint.find()
.populate(
'buyer',
'username'
)
.populate(
'seller',
'username'
)
.populate(
'order'
)
.sort({
createdAt:-1
});

res.json(complaints);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.updateComplaintStatus =
async(req,res)=>{

try{

const complaint =
await Complaint.findById(
req.params.id
);

if(!complaint){

return res.status(404)
.json({
message:
'Complaint not found'
});

}

complaint.status =
req.body.status;

await complaint.save();

res.json(complaint);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
