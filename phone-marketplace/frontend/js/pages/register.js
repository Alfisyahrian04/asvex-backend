const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(currentUser){

if(
currentUser.role ===
'seller'
){

window.location.href =
'seller.html';

}else if(
currentUser.role ===
'admin'
){

window.location.href =
'admin.html';

}else if(
currentUser.role ===
'customer_service'
){

window.location.href =
'customer-service.html';

}else{

window.location.href =
'index.html';

}

}

const registerForm =
document.getElementById(
'registerForm'
);

if(registerForm){

registerForm.addEventListener(
'submit',
async(e)=>{

e.preventDefault();

const username =
document.getElementById(
'username'
).value.trim();

const email =
document.getElementById(
'email'
).value.trim();

const password =
document.getElementById(
'password'
).value.trim();

const role =
document.getElementById(
'role'
).value;

const adminKeyInput =
document.getElementById(
'adminKey'
);

const adminKey =
adminKeyInput
? adminKeyInput.value.trim()
: '';

const registerButton =
document.querySelector(
'#registerForm button'
);

registerButton.disabled =
true;

registerButton.innerText =
'Loading...';

if(
!username ||
!email ||
!password
){

alert(
'Lengkapi semua field'
);

registerButton.disabled =
false;

registerButton.innerText =
'Register';

return;

}

try{

const response =
await fetch(
`${BASE_URL}/auth/register`,
{
method:'POST',

headers:{
'Content-Type':
'application/json'
},

body:JSON.stringify({

username,
email,
password,
role,
adminKey

})
}
);

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Register gagal'
);

registerButton.disabled =
false;

registerButton.innerText =
'Register';

return;

}

console.log(
data.user.role
);

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

registerButton.disabled =
false;

registerButton.innerText =
'Register';

if(
data.user.role ===
'seller'
){

window.location.href =
'seller.html';

}else if(
data.user.role ===
'admin'
){

window.location.href =
'admin.html';

}else if(
data.user.role ===
'customer_service'
){

window.location.href =
'customer-service.html';

}else{

window.location.href =
'index.html';

}

}catch(err){

console.log(err);

alert(
'Server error / backend offline'
);

registerButton.disabled =
false;

registerButton.innerText =
'Register';

}

});
}
