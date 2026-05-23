protectPage();

const ordersContainer =
document.getElementById(
'orders-container'
);

async function loadOrders(){

try{

const orders =
await getMyOrders();

renderOrders(
orders
);

}catch(error){

ordersContainer.innerHTML = `

<div class="empty-product">

Gagal memuat transaksi

</div>

`;

}

}

function renderOrders(orders){

if(!orders.length){

ordersContainer.innerHTML = `

<div class="empty-product">

Belum ada transaksi

</div>

`;

return;

}

ordersContainer.innerHTML =
orders.map(order=>`

<div class="order-card">

<img
src="${
order.product?.images?.[0]
}"
class="order-image"
/>

<div class="order-info">

<h3>
${order.product?.name}
</h3>

<p>
Rp ${Number(order.totalPrice)
.toLocaleString('id-ID')}
</p>

<div class="order-status">

${order.paymentStatus}

</div>

<div class="tracking-number">

Resi:
${order.trackingNumber}

</div>

<div class="delivery-status">

${order.deliveryStatus}

</div>

</div>

</div>

`).join('');

}

socket.on(
'order-updated',
()=>{

loadOrders();

});

loadOrders();
