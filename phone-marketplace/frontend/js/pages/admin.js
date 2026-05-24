protectPage();

requireRole('admin');

const token =
localStorage.getItem(
'token'
);

/* SELLER */

async function loadUsers(){

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

const users =
await response.json();

const sellerList =
document.getElementById(
'seller-list'
);

sellerList.innerHTML =
users
.filter(
user =>
user.role === 'seller'
)
.map(user=>`

<div class="admin-card">

<h3>${user.username}</h3>
<p>${user.email}</p>
<p>Verified: ${user.verificationStatus}</p>

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

const orders =
await response.json();

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

<p>${order.status}</p>

<button
onclick="approvePayment('${order._id}')"
>
Approve Payment
</button>

</div>

`).join('');

}catch(error){

console.log(error);

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

/* PATCH START */

window.approvePayment =
approvePayment;

window.verifySeller =
verifySeller;

window.banUser =
banUser;

/* PATCH END */

loadUsers();
loadPendingPayments();
