function renderBottomNav(active){

return `

<nav class="bottom-nav">

<a
href="index.html"
class="nav-item ${
active === 'home'
? 'active'
: ''
}"
>

<i class="fa-solid fa-house"></i>

<span>
Home
</span>

</a>

<a
href="wishlist.html"
class="nav-item ${
active === 'wishlist'
? 'active'
: ''
}"
>

<i class="fa-solid fa-heart"></i>

<span>
Wishlist
</span>

</a>

<a
href="orders.html"
class="nav-item ${
active === 'orders'
? 'active'
: ''
}"
>

<i class="fa-solid fa-receipt"></i>

<span>
Transaksi
</span>

</a>

<a
href="profile.html"
class="nav-item ${
active === 'profile'
? 'active'
: ''
}"
>

<i class="fa-solid fa-user"></i>

<span>
Akun
</span>

</a>

</nav>

`;

}

window.renderBottomNav =
renderBottomNav;
