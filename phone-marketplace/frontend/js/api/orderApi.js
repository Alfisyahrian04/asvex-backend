const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1/orders';


async function createOrder(data){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
BASE_URL,
{
method:'POST',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify({

productId:
data.productId,

quantity:
data.quantity || 1,

shippingAddress:
data.shippingAddress || '',

courier:
data.courier || '',

paymentMethod:
data.paymentMethod || '',

paymentProof:
data.paymentProof || '',

shippingCourier:
data.shippingCourier || '',

shippingCost:
data.shippingCost || 0,

variant:
data.variant || {}

})

}
);

let result;

try{

result =
await response.json();

}catch{

result = null;

}

if(!response.ok){

console.error(
'ORDER CREATE ERROR:',
result
);

throw new Error(
result?.message ||
result?.error ||
`Checkout gagal (${response.status})`
);

}

return result;

}



async function fetchMyOrders(){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/my-orders`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

if(!response.ok){

throw new Error(
data.message ||
'Gagal mengambil order'
);

}

return data;

}



/* SUBMIT PAYMENT */

async function submitPayment(orderId,data){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${orderId}/payment`,
{
method:'PUT',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify(data)

}
);

const result =
await response.json();

if(!response.ok){

throw new Error(
result.message ||
'Gagal kirim pembayaran'
);

}

return result;

}



/* COMPLETE ORDER */

async function completeOrder(id){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${id}/complete`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.json();

}



/* CANCEL ORDER */

async function cancelOrder(id){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${id}/cancel`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.json();

}



/* RETURN ORDER */

async function requestReturn(id){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${id}/return`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.json();

}



/* GLOBAL */

window.createOrder =
createOrder;

window.fetchMyOrders =
fetchMyOrders;

window.submitPayment =
submitPayment;

window.completeOrder =
completeOrder;

window.cancelOrder =
cancelOrder;

window.requestReturn =
requestReturn;
