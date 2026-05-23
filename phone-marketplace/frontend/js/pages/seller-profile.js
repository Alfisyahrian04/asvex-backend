const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(
!currentUser ||
currentUser.role !==
'seller'
){

window.location.href =
'login.html';

}

document.getElementById(
'profile-username'
).innerText =
currentUser.username;

document.getElementById(
'profile-email'
).innerText =
currentUser.email;

function logout(){

localStorage.removeItem(
'user'
);

localStorage.removeItem(
'token'
);

window.location.href =
'login.html';

}
