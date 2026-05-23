const cartStore = {

getCart(){

return JSON.parse(
localStorage.getItem('cart')
) || [];

},

saveCart(cart){

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

},

addToCart(product){

let cart =
this.getCart();

const existing =
cart.find(
item =>
item._id === product._id
);

if(existing){

existing.quantity += 1;

}else{

cart.push({
...product,
quantity:1
});

}

this.saveCart(cart);

},

removeFromCart(productId){

let cart =
this.getCart();

cart = cart.filter(
item =>
item._id !== productId
);

this.saveCart(cart);

},

clearCart(){

localStorage.removeItem(
'cart'
);

},

getCartCount(){

const cart =
this.getCart();

return cart.reduce(
(total,item)=>
total + item.quantity,
0
);

},

getCartTotal(){

const cart =
this.getCart();

return cart.reduce(
(total,item)=>
total + (
item.price *
item.quantity
),
0
);

}

};

window.cartStore =
cartStore;
