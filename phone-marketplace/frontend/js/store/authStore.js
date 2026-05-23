const authStore = {

getUser(){

return JSON.parse(
localStorage.getItem('user')
);

},

getToken(){

return localStorage.getItem(
'token'
);

},

isAuthenticated(){

return !!localStorage.getItem(
'token'
);

},

saveAuth(token,user){

localStorage.setItem(
'token',
token
);

localStorage.setItem(
'user',
JSON.stringify(user)
);

},

logout(){

localStorage.removeItem(
'token'
);

localStorage.removeItem(
'user'
);

window.location.href =
'login.html';

},

getRole(){

const user =
this.getUser();

return user?.role || null;

}

};

window.authStore =
authStore;
