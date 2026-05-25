if (typeof protectPage === 'function') {
  protectPage();
}

if (typeof requireRole === 'function') {
  requireRole('admin');
}

const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const token =
localStorage.getItem('token');


/* SELLER */

async function loadUsers(){

try{

const response =
await fetch(
`${BASE_URL}/admin/users`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result =
await response.json();

const users =
result.users || result || [];

const sellerList =
document.getElementById('seller-list');

if(!sellerList) return;

const sellers =
users.filter(
user => user.role === 'seller'
);

if(!sellers.length){

sellerList.innerHTML =
`<div class="empty-state">Belum ada seller</div>`;

return;
}

sellerList.innerHTML =
sellers.map(user=>`

<div class="admin-card">

<h3>${user.username || '-'}</h3>

<p>${user.email || '-'}</p>

<p>
Verified:
${user.isVerifiedSeller ? 'verified' : 'pending'}
</p>

<button onclick="verifySeller('${user._id}')">
Verify
</button>

<button
onclick="banUser('${user._id}')"
style="background:#ef4444;"
>
Ban
</button>

</div>

`).join('');

}catch(error){

console.log(
'LOAD USERS ERROR:',
error
);

}

}



async function verifySeller(id){

await fetch(
`${BASE_URL}/admin/verify-seller/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadUsers();

}



async function banUser(id){

await fetch(
`${BASE_URL}/admin/ban-user/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadUsers();

}



/* PAYMENT */

async function loadPendingPayments(){

try{

const response =
await fetch(
`${BASE_URL}/admin/pending-payments`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

if(!response.ok){
throw new Error(
'Failed load pending payments'
);
}

const result =
await response.json();

const orders =
Array.isArray(result)
? result
: result.orders || [];

const paymentList =
document.getElementById(
'payment-list'
);

if(!paymentList) return;

if(!orders.length){

paymentList.innerHTML =
`<div class="empty-state">Belum ada pembayaran</div>`;

return;

}

paymentList.innerHTML =
orders.map(order=>{

const paymentImage =
order.paymentProof &&
order.paymentProof !== 'uploaded'
? order.paymentProof
: (
order.product?.images?.[0] ||
'https://via.placeholder.com/300'
);

return `

<div class="admin-card">

<img
src="${paymentImage}"
>

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
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
Bank Pengirim:
${order.senderBank || '-'}
</p>

<p>
Atas Nama:
${order.senderName || '-'}
</p>

<p>
Transfer Ke:
${order.adminPaymentMethod || '-'}
</p>

<p>
Rp ${Number(
order.totalPrice || 0
).toLocaleString('id-ID')}
</p>

<p>
Status:
${order.status || '-'}
</p>

<button
onclick="approvePayment('${order._id}')"
>
Approve Payment
</button>

<button
onclick="rejectPayment('${order._id}')"
style="
background:#ef4444;
margin-top:10px;
"
>
Reject Payment
</button>

</div>
`;
}).join('');

}catch(error){

console.log(
'LOAD PAYMENT ERROR:',
error
);

}

}



async function approvePayment(id){

try{

await fetch(
`${BASE_URL}/admin/verify-payment/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadPendingPayments();

}catch(error){

console.log(error);

}

}



async function rejectPayment(id){

try{

await fetch(
`${BASE_URL}/admin/orders/${id}/reject`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadPendingPayments();

}catch(error){

console.log(error);

}

}



/* REFUND */

async function loadRefundRequests(){

try{

const response =
await fetch(
`${BASE_URL}/admin/refund-requests`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result =
await response.json();

const orders =
result.orders || [];

const refundList =
document.getElementById(
'refund-list'
);

if(!refundList) return;

if(!orders.length){

refundList.innerHTML =
`<div class="empty-state">Belum ada refund request</div>`;

return;

}

refundList.innerHTML =
orders.map(order=>`

<div class="admin-card">

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
</p>

<p>
Alasan Refund:
${order.refundReason || '-'}
</p>

<p>
Status:
${order.refundStatus || 'pending'}
</p>

<button
onclick="approveRefund('${order._id}')"
style="margin-top:10px;"
>
Approve Refund
</button>

</div>

`).join('');

}catch(error){

console.log(
'LOAD REFUND ERROR:',
error
);

}

}



async function approveRefund(id){

try{

await fetch(
`${BASE_URL}/admin/approve-refund/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadRefundRequests();

}catch(error){

console.log(error);

}

}



window.rejectPayment =
rejectPayment;

window.approvePayment =
approvePayment;

window.verifySeller =
verifySeller;

window.banUser =
banUser;

window.approveRefund =
approveRefund;


loadUsers();
loadPendingPayments();
loadRefundRequests();
