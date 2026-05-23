exports.generateTrackingNumber =
()=>{

const random =
Math.random()
.toString()
.slice(2,10);

return `ALG${random}`;

};

exports.createShipment =
async(order)=>{

return {

courier:'JNE',

trackingNumber:
exports.generateTrackingNumber(),

status:'processing'

};

};
