const Order =
require('../models/Order');

exports.handleWebhook =
async(req,res)=>{

try{

const {
order_id,
transaction_status
} = req.body;

const order =
await Order.findById(
order_id
);

if(!order){

return res.status(404)
.json({
message:
'Order not found'
});

}

if(
transaction_status ===
'settlement'
){

order.paymentStatus =
'paid';

order.status =
'paid';

/* PATCH SAFE CHECK */
if(
order.timeline &&
Array.isArray(
order.timeline
)
){
order.timeline.push({

title:'Payment Success',

description:
'Buyer completed payment'

});
}

}

if(
transaction_status ===
'expire'
){

order.paymentStatus =
'failed';

}

await order.save();

res.status(200)
.json({
message:'Webhook received'
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
