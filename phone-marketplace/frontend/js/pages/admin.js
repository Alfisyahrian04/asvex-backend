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
document.getElementById(
'seller-list'
);

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

<button
onclick="verifySeller('${user._id}')"
>
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
orders.map(order=>`

<div class="admin-card">

<img
src="${
order.paymentProof ||
order.product?.images?.[0]
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

`).join('');

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
`
<div class="empty-state">
Belum ada refund request
</div>
`;

return;
}

refundList.innerHTML =
orders.map(order=>{

if(order.status === 'appeal_submitted'){
return `

<div class="admin-card">

<h3>${order.product?.name || 'Produk'}</h3>

<p>Buyer:
${order.buyer?.username || '-'}</p>

<p>Seller:
${order.seller?.storeName || '-'}</p>

<p style="color:#2563eb;font-weight:700;">
Seller Mengajukan Banding
</p>

<p>
Alasan banding:
${order.appealReason || '-'}
</p>

${
order.appealPhoto
? `
<img
src="${order.appealPhoto}"
style="
width:100%;
margin-top:12px;
border-radius:12px;
"
/>
`
: ''
}

${
order.appealVideo
? `
<video
src="${order.appealVideo}"
controls
style="
width:100%;
margin-top:12px;
border-radius:12px;
"
></video>
`
: ''
}

</div>

`;
}

return `
  
<div class="admin-card">

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
</p>

<p>
Seller:
${order.seller?.storeName || '-'}
</p>

<p>
Alasan:
${order.refundReason || '-'}
</p>

<p>
Bank:
${order.refundBankName || '-'}
</p>

<p>
Atas Nama:
${order.refundAccountName || '-'}
</p>

<p>
No Rekening:
${order.refundAccountNumber || '-'}
</p>

${
order.unboxingVideo
? `
<video
src="${order.unboxingVideo}"
controls
style="
width:100%;
margin-top:12px;
border-radius:12px;
"
></video>
`
: ''
}

<label
for="refund-proof-${order._id}"
style="
display:block;
margin-top:14px;
padding:14px;
border-radius:14px;
border:2px dashed #fb923c;
text-align:center;
cursor:pointer;
background:#fff7ed;
"
>
📤 Upload Bukti Transfer Refund (Wajib)
</label>

<input
type="file"
accept="image/*"
id="refund-proof-${order._id}"
style="display:none"
onchange="previewRefundProof('${order._id}')"
/>

<div
id="refund-proof-name-${order._id}"
style="
font-size:13px;
margin-top:8px;
color:#2563eb;
"
></div>

<button
onclick="completeRefund('${order._id}')"
style="
margin-top:14px;
width:100%;
height:48px;
border:none;
border-radius:14px;
background:#16a34a;
color:#fff;
font-weight:700;
cursor:pointer;
"
>
Selesai Refund
</button>

</div>

`;
}).join('');

}catch(error){

console.log(error);

}

}



/* PREVIEW */

window.previewRefundProof =
function(orderId){

const input =
document.getElementById(
`refund-proof-${orderId}`
);

const label =
document.getElementById(
`refund-proof-name-${orderId}`
);

if(
input.files &&
input.files[0]
){
label.innerHTML =
`File dipilih: ${input.files[0].name}`;
}

};



/* COMPLETE REFUND */

async function completeRefund(orderId){

try{

const input =
document.getElementById(
`refund-proof-${orderId}`
);

if(
!input.files ||
!input.files[0]
){
alert(
'Upload bukti transfer refund wajib diisi'
);
return;
}

const file =
input.files[0];

const refundTransferProof =
await new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
()=>resolve(
reader.result
);

reader.onerror =
reject;

reader.readAsDataURL(file);

}
);

await fetch(
`${BASE_URL}/admin/approve-refund/${orderId}`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
refundTransferProof,
refundCompleted:true
})
}
);

alert(
'Refund berhasil diselesaikan'
);

loadRefundRequests();

}catch(error){

console.log(error);

}

}



/* ACTION */

async function approvePayment(id){

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

}

async function rejectPayment(id){

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


window.completeRefund =
completeRefund;
window.rejectPayment =
rejectPayment;
window.approvePayment =
approvePayment;
window.verifySeller =
verifySeller;
window.banUser =
banUser;

loadUsers();
loadPendingPayments();
loadRefundRequests();
