protectPage();

requireRole('admin');

const token =
localStorage.getItem(
'token'
);

/* SELLER */

async function loadUsers(){

try{

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/admin/users',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const result =
await response.json();

const users =
result.users || result || [];

const sellerList =
document.getElementById(
'seller-list'
);

const sellers =
users.filter(
user =>
user.role === 'seller'
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
<p>Verified:
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

document.getElementById(
'seller-list'
).innerHTML =
`<div class="empty-state">Belum ada seller</div>`;

}

}

async function verifySeller(id){

await fetch(
`https://asvex-backend-production.up.railway.app/api/v1/admin/verify-seller/${id}`,
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
`https://asvex-backend-production.up.railway.app/api/v1/admin/ban-user/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadUsers();

}

/* PAYMENT VALIDATION */

async function loadPendingPayments(){

try{

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/admin/pending-payments',
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

let orders =
await response.json();

orders =
Array.isArray(orders)
? orders
: orders.orders || [];

orders =
orders.filter(order =>

order.status ===
'waiting_payment_verification'

||

order.status ===
'pending'

||

order.status ===
'paid'

||

order.paymentStatus ===
'waiting_verification'

||

order.paymentStatus ===
'paid'

);

const paymentList =
document.getElementById(
'payment-list'
);

if(!orders.length){

paymentList.innerHTML =
`<div class="empty-state">Belum ada pembayaran</div>`;

return;

}

paymentList.innerHTML =
orders.map(order=>`

<div class="admin-card">

<img
src="${
order.paymentProof ||
order.product?.images?.[0] ||
'https://via.placeholder.com/300'
}"
>

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
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

</div>

`).join('');

}catch(error){

console.log(
'PAYMENT ERROR:',
error
);

document.getElementById(
'payment-list'
).innerHTML =
`<div class="empty-state">Belum ada pembayaran</div>`;

}

}

/* PAYOUT REQUEST */

async function loadPayoutRequests(){

try{

const payoutList =
document.getElementById(
'payout-list'
);

if(!payoutList) return;

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/admin/payout-requests',
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result =
await response.json();

const payouts =
result.payouts || result || [];

if(!payouts.length){

payoutList.innerHTML =
`<div class="empty-state">Belum ada payout request</div>`;

return;

}

payoutList.innerHTML =
payouts.map(item=>`

<div class="admin-card">

<h3>
${item.seller?.username || 'Seller'}
</h3>

<p>
Rp ${Number(
item.totalPrice || item.amount || 0
).toLocaleString('id-ID')}
</p>

<p>
Status:
${item.payoutStatus || 'pending'}
</p>

</div>

`).join('');

}catch(error){

console.log(
'PAYOUT ERROR:',
error
);

document.getElementById(
'payout-list'
).innerHTML =
`<div class="empty-state">Belum ada payout request</div>`;

}

}

async function approvePayment(id){

await fetch(
`https://asvex-backend-production.up.railway.app/api/v1/admin/orders/${id}/approve`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadPendingPayments();

}

window.approvePayment =
approvePayment;

window.verifySeller =
verifySeller;

window.banUser =
banUser;

loadUsers();
loadPendingPayments();
loadPayoutRequests();
