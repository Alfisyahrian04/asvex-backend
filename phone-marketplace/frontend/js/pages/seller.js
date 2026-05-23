const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(
!currentUser
){

window.location.href =
'login.html';

}

if(
currentUser.role !==
'seller'
){

window.location.href =
'index.html';

}

const sellerUsername =
document.getElementById(
'seller-username'
);

if(sellerUsername){

sellerUsername.innerText =
currentUser.username;

}

const token =
localStorage.getItem(
'token'
);

/* LOAD SELLER ORDERS */

async function
loadSellerOrders(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller-orders`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const orders =
await response.json();

const pendingOrders =
document.getElementById(
'pending-orders'
);

if(!pendingOrders){

return;

}

if(
!orders.length
){

pendingOrders.innerHTML =
`
<div class="empty-state">
Belum ada pesanan
</div>
`;

return;

}

pendingOrders.innerHTML =
orders.map(order=>`

<div class="product-card">

<img
src="${
order.product?.images?.[0] ||
'https://via.placeholder.com/300'
}"
>

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Qty:
${order.quantity}
</p>

<p>
Rp ${
Number(
order.totalPrice || 0
).toLocaleString(
'id-ID'
)
}
</p>

<p>
Status:
${order.status}
</p>

<button
onclick="processOrder('${order._id}')"
class="password-btn"
style="margin-top:10px;height:45px;"
>

Proses Pesanan

</button>

</div>

`).join('');

}catch(error){

console.log(error);

}

}

/* PROCESS ORDER */

async function
processOrder(orderId){

try{

const response =
await fetch(
`${BASE_URL}/orders/${orderId}/status`,
{
method:'PUT',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify({

status:'processed'

})

}
);

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Gagal update status'
);

return;

}

alert(
'Pesanan diproses'
);

loadSellerOrders();

}catch(error){

console.log(error);

alert(
'Server error'
);

}

}

/* LOAD STATS */

async function
loadSellerStats(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller/stats`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

const sellerBalance =
document.getElementById(
'seller-balance'
);

const monthlyIncome =
document.getElementById(
'monthly-income'
);

const totalOrders =
document.getElementById(
'total-orders'
);

if(sellerBalance){

sellerBalance.innerText =
`RP ${Number(
data.balance || 0
).toLocaleString(
'id-ID'
)}`;

}

if(monthlyIncome){

monthlyIncome.innerText =
`RP ${Number(
data.monthlyRevenue || 0
).toLocaleString(
'id-ID'
)}`;

}

if(totalOrders){

totalOrders.innerText =
`${data.totalOrders || 0} UNIT`;

}

}catch(error){

console.log(error);

}

}

window.processOrder =
processOrder;

loadSellerOrders();

loadSellerStats();
