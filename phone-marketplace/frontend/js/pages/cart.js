let cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

const container =
document.getElementById(
'cart-items'
);

const totalEl =
document.getElementById(
'cart-total'
);


async function getRealtimeStock(productId){

try{

const response =
await fetch(
`https://asvex-backend-production.up.railway.app/api/v1/products/${productId}`
);

if(!response.ok){
return 0;
}

const product =
await response.json();

return Number(
product.stock ?? 0
);

}catch(error){

console.log(error);
return 0;

}

}



function renderCart(){

cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

if(!cart.length){

container.innerHTML = `
<div class="empty-cart">
Keranjang kosong
</div>
`;

totalEl.innerText =
'Rp 0';

return;

}

container.innerHTML =
cart.map((item,index)=>`

<div class="cart-card">

<img
src="${item.images?.[0] || ''}"
>

<div class="cart-info">

<h3>
${item.name}
</h3>

<p>
Rp ${Number(
item.price
).toLocaleString('id-ID')}
</p>

<p>
Stock:
${item.stock || 0}
</p>

<div class="cart-qty-control">

<button
onclick="decreaseQty(${index})"
>
-
</button>

<span>
${item.quantity || 1}
</span>

<button
onclick="increaseQty(${index})"
>
+
</button>

</div>

<button
onclick="removeCart(${index})"
>
Hapus
</button>

</div>

</div>

`).join('');

const total =
cart.reduce(
(acc,item)=>
acc +
(
item.price *
item.quantity
),
0
);

totalEl.innerText =
`Rp ${total.toLocaleString('id-ID')}`;

}



window.increaseQty =
async function(index){

cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

const item =
cart[index];

if(!item) return;

const realtimeStock =
await getRealtimeStock(
item._id
);

const currentQty =
Number(
item.quantity || 1
);

if(realtimeStock <= 0){

alert(
'Stok produk habis'
);

return;

}

if(
currentQty >= realtimeStock
){

item.quantity =
realtimeStock;

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

alert(
`Stok tersedia hanya ${realtimeStock}`
);

renderCart();
return;

}

item.quantity =
currentQty + 1;

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

renderCart();

};



window.decreaseQty =
function(index){

cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

if(
cart[index].quantity > 1
){
cart[index].quantity -= 1;
}

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

renderCart();

};



window.removeCart =
function(index){

cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

cart.splice(index,1);

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

renderCart();

};



/* CHECKOUT VALIDATION PATCH */

window.validateCheckoutStock =
async function(){

cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

for(
let item of cart
){

const realtimeStock =
await getRealtimeStock(
item._id
);

if(
realtimeStock <= 0
){
alert(
`${item.name} stok habis`
);
return false;
}

if(
item.quantity > realtimeStock
){
alert(
`${item.name} melebihi stok tersedia`
);
return false;
}

}

return true;

};


renderCart();
