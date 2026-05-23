function protectPage(){

const token =
localStorage.getItem(
'token'
);

if(!token){

window.location.href =
'login.html';

}

}

function requireRole(role){

const user =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(
!user ||
user.role !== role
){

window.location.href =
'index.html';

}

}

window.protectPage =
protectPage;

window.requireRole =
requireRole;
