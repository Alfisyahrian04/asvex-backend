const ORDER_API =
'https://asvex-backend-production.up.railway.app/api/v1/orders';

async function createOrder(data){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
ORDER_API,
{
method:'POST',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify(data)
}
);

if(!response.ok){

throw new Error(
'Failed create order'
);

}

return await response.json();

}

async function getMyOrders(){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${ORDER_API}/my-orders`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

if(!response.ok){

throw new Error(
'Failed get orders'
);

}

return await response.json();

}

window.createOrder =
createOrder;

window.getMyOrders =
getMyOrders;
