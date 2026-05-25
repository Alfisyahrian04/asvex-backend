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

if(!user){

window.location.href =
'index.html';
return;

}

/* PATCH START */

const currentRole =
String(
user.role || ''
)
.trim()
.toLowerCase();

const requiredRole =
String(
role || ''
)
.trim()
.toLowerCase();

if(
currentRole !== requiredRole
){

window.location.href =
'index.html';
return;

}

/* PATCH END */

}

window.protectPage =
protectPage;

window.requireRole =
requireRole;
