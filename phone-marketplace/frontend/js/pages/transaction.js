const transactionList =
document.getElementById(
'transaction-list'
);

const token =
localStorage.getItem(
'token'
);

const BASE_URL =
'https://asvex-backend.up.railway.app/api/v1';

async function renderOrders(){

try{

const response =
await fetch(
`${BASE_URL}/orders/my`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const orders =
await response.json();

if(
!Array.isArray(orders) ||
!orders.length
){

transactionList.innerHTML = `

<div class="empty-state">
Belum ada transaksi
</div>

`;

return;

}

transactionList.innerHTML =
orders.map(order=>`

<div class="history-card">

<div class="history-top">

<div class="invoice">
INV-${order._id?.slice(-8)}
</div>

<div class="status">
${order.status || 'pending'}
</div>

</div>

<div class="history-product">
${order.product?.name || '-'}
</div>

<div class="history-total">
Total: Rp ${Number(
order.totalPrice || 0
).toLocaleString('id-ID')}
</div>

</div>

`).join('');

}catch(error){

console.log(
'TRANSACTION ERROR:',
error
);

transactionList.innerHTML = `

<div class="empty-state">
Belum ada transaksi
</div>

`;

}

}

renderOrders();
