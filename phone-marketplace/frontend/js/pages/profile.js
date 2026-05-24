const user =
JSON.parse(
localStorage.getItem(
'user'
)
);

if (!user) {

window.location.href =
'./login.html';

}

document.getElementById(
'profile-name'
).innerText =
user.fullName ||
user.name ||
user.username ||
'User';

document.getElementById(
'profile-email'
).innerText =
user.email || '-';

/* PATCH START */

if(
document.getElementById(
'profile-phone'
)
){
document.getElementById(
'profile-phone'
).innerText =
user.phone || '-';
}

/* PATCH END */

document.getElementById(
'logout-btn'
).addEventListener(
'click',
()=>{

localStorage.removeItem(
'token'
);

localStorage.removeItem(
'user'
);

alert(
'Logout berhasil'
);

window.location.href =
'./login.html';

}
);
