protectPage();

requireRole('admin');

const token =
localStorage.getItem(
'token'
);

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

<h3>
${user.username}
</h3>

<p>
${user.email}
</p>

<p>
Verified:
${user.verificationStatus}
</p>

<button
onclick="
verifySeller(
'${user._id}'
)
"
>

Verify

</button>

<button
onclick="
banUser(
'${user._id}'
)
"
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
Authorization:
`Bearer ${token}`
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
Authorization:
`Bearer ${token}`
}
}
);

loadUsers();

}

async function loadPayouts(){

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/admin/payouts',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const payouts =
await response.json();

const payoutList =
document.getElementById(
'payout-list'
);

payoutList.innerHTML =
payouts.map(payout=>`

<div class="admin-card">

<h3>
${payout.seller?.username}
</h3>

<p>
Rp ${Number(payout.amount)
.toLocaleString('id-ID')}
</p>

<p>
${payout.status}
</p>

<button
onclick="
approvePayout(
'${payout._id}'
)
"
>

Approve

</button>

</div>

`).join('');

}

async function approvePayout(id){

await fetch(
`https://asvex-backend-production.up.railway.app/api/v1/admin/approve-payout/${id}`,
{
method:'PUT',

headers:{
Authorization:
`Bearer ${token}`
}
}
);

loadPayouts();

}

loadUsers();

loadPayouts();
