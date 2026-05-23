exports.detectFraud =
(order)=>{

if(order.totalPrice >
100000000){

return true;

}

return false;

};
