const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(currentUser){

window.location.href =
'index.html';

}

const loginForm =
document.getElementById(
'loginForm'
);

if(loginForm){

loginForm.addEventListener(
'submit',
async(e)=>{

e.preventDefault();

const email =
document.getElementById(
'email'
).value.trim();

const password =
document.getElementById(
'password'
).value.trim();

if(
!email ||
!password
){

alert(
'Lengkapi semua field'
);

return;

}

try{

const response =
await fetch(
`${BASE_URL}/auth/login`,
{
method:'POST',

headers:{
'Content-Type':
'application/json'
},

body:JSON.stringify({
email,
password
})
}
);

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Login gagal'
);

return;

}

localStorage.setItem(
'user',
JSON.stringify(
data.user
)
);

localStorage.setItem(
'token',
data.token
);

window.location.href =
'index.html';

}catch(err){

console.log(err);

alert(
'Server error'
);

}

});
}
