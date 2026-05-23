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

const loginButton =
document.querySelector(
'#loginForm button'
);

loginButton.disabled =
true;

loginButton.innerText =
'Loading...';

if(
!email ||
!password
){

alert(
'Lengkapi semua field'
);

loginButton.disabled =
false;

loginButton.innerText =
'Login';

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

loginButton.disabled =
false;

loginButton.innerText =
'Login';

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

loginButton.disabled =
false;

loginButton.innerText =
'Login';

window.location.href =
'index.html';

}catch(err){

console.log(err);

alert(
'Server error / backend offline'
);

loginButton.disabled =
false;

loginButton.innerText =
'Login';

}

});
}
