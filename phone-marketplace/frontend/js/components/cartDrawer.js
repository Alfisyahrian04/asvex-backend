export default function cartDrawer(
cart = []
) {

return `

<div
class="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-2xl p-6 overflow-y-auto"
>

<div class="flex justify-between items-center mb-6">

<h2 class="text-2xl font-bold">
Keranjang
</h2>

<button id="closeCart">
✕
</button>

</div>

<div class="space-y-4">

${cart.map(item => `

<div class="flex gap-4">

<img
src="${item.images?.[0]}"
class="w-20 h-20 rounded-2xl object-cover"
/>

<div class="flex-1">

<div class="font-semibold">
${item.name}
</div>

<div class="text-green-600 font-bold mt-2">
Rp ${item.price}
</div>

${
item.variant
? `
<div class="text-sm text-gray-500 mt-1">
${item.variant.color || ''}
${item.variant.storage || ''}
</div>
`
: ''
}

</div>

</div>

`).join('')}

</div>

<button
id="checkout-btn"
class="btn-primary w-full mt-6"
onclick="openCheckoutModal()"
>
Checkout
</button>

</div>

`;

}

/* =========================
PATCH FIX
SYNC CHECKOUT BUTTON
========================= */

document.addEventListener(
'DOMContentLoaded',
()=>{

const checkoutBtn =
document.getElementById(
'checkout-btn'
);

if(checkoutBtn){

checkoutBtn.addEventListener(
'click',
()=>{

if(
typeof openCheckoutModal ===
'function'
){
openCheckoutModal();
}

}
);

}

}
);
