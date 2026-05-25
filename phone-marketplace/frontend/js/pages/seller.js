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


/* STATUS LABEL PATCH */

function getStatusLabel(order){

if(
order.status ===
'waiting_confirmation'
){
return 'Menunggu Konfirmasi Pembayaran';
}

if(
order.paymentStatus ===
'waiting_verification'
){
return 'Menunggu Konfirmasi Pembayaran';
}

if(
order.paymentStatus ===
'paid' &&
(
order.status === 'paid' ||
order.status === 'pending' ||
order.status === 'pending_payment'
)
){
return 'Menunggu Diproses';
}

if(
order.status === 'processed'
){
return 'Sedang Diproses';
}

if(
order.status === 'shipped'
){
return 'Sedang Dikirim';
}

if(
order.status === 'completed'
){
return 'Pesanan Selesai';
}

if(
order.status === 'cancelled'
){
return 'Pesanan Dibatalkan';
}

return order.status || 'Pending';

}


/* LOAD SELLER ORDERS */

async function loadSellerOrders(){

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

if(!orders.length){

pendingOrders.innerHTML =
`
<div class="empty-state">
Belum ada pesanan
</div>
`;

return;

}

pendingOrders.innerHTML =
orders.map(order=>{

const canProcess =
order.paymentStatus === 'paid';

let buttonHtml =
canProcess
?
`
<button
onclick="processOrder('${order._id}')"
class="password-btn"
style="margin-top:12px;height:45px;"
>
Proses Pesanan
</button>
`
:
`
<button
disabled
class="password-btn"
style="
margin-top:12px;
height:45px;
opacity:.6;
cursor:not-allowed;
"
>
Menunggu Pembayaran
</button>
`;



/* PATCH START SHIPPING FORM */

if(
order.status === 'processed'
){

buttonHtml += `

<div style="
margin-top:12px;
display:flex;
flex-direction:column;
gap:10px;
">

<input
id="resi-${order._id}"
placeholder="Input nomor resi"
style="
height:45px;
padding:10px;
border-radius:10px;
border:1px solid #ddd;
"
/>

<input
id="foto-${order._id}"
placeholder="Link foto bukti paket"
style="
height:45px;
padding:10px;
border-radius:10px;
border:1px solid #ddd;
"
/>

<button
onclick="shipOrder('${order._id}')"
class="password-btn"
style="height:45px;"
>
Paket Sudah Dikirim
</button>

</div>

`;

}

/* PATCH END SHIPPING FORM */



return `

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
Kategori:
${order.product?.category || '-'}
</p>

<p>
Berat:
${order.product?.weight || '-'} gram
</p>

<p>
Qty:
${order.quantity || 1}
</p>

<p>
Variant:
${order.variant?.color || '-'}
${order.variant?.storage ? ` / ${order.variant.storage}` : ''}
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
${getStatusLabel(order)}
</p>

<hr style="
margin:12px 0;
border:none;
border-top:1px solid #eee;
">

<p>
Penerima:
${order.receiverName || '-'}
</p>

<p>
No Telp:
${order.receiverPhone || '-'}
</p>

<p>
Alamat:
${order.receiverAddress || '-'}
</p>

<p>
Metode Transfer:
${order.adminPaymentMethod || '-'}
</p>

<p>
Bank Pengirim:
${order.senderBank || '-'}
</p>

<p>
Atas Nama:
${order.senderName || '-'}
</p>

${
order.status === 'shipped'
&& order.trackingNumber
? `
<p>
No Resi:
${order.trackingNumber}
</p>
`
: ''
}

${
order.status === 'shipped'
&& order.shippingPhoto
? `
<img
src="${order.shippingPhoto}"
style="
margin-top:10px;
border-radius:12px;
width:100%;
"
/>
`
: ''
}

${buttonHtml}

</div>

`;

}).join('');

}catch(error){

console.log(error);

}

}


/* PROCESS ORDER */

async function processOrder(orderId){

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



/* PATCH START SHIP ORDER */

async function shipOrder(orderId){

try{

const trackingNumber =
document.getElementById(
`resi-${orderId}`
)?.value || '';

const shippingPhoto =
document.getElementById(
`foto-${orderId}`
)?.value || '';

const response =
await fetch(
`${BASE_URL}/seller/shipping/${orderId}`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
trackingNumber,
shippingPhoto
})
}
);

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Gagal kirim paket'
);

return;

}

alert(
'Paket berhasil dikirim'
);

loadSellerOrders();

}catch(error){

console.log(error);

alert(
'Server error'
);

}

}

/* PATCH END SHIP ORDER */



/* LOAD STATS */

async function loadSellerStats(){

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

/* PATCH */
window.shipOrder =
shipOrder;
/* PATCH */

loadSellerOrders();

loadSellerStats();
