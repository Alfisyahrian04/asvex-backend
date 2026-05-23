const NOTIFICATION_API =
'https://asvex-backend-production.up.railway.app/api/v1/notifications';

async function fetchNotifications(){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
NOTIFICATION_API,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

if(!response.ok){

throw new Error(
'Failed fetch notifications'
);

}

return await response.json();

}

window.fetchNotifications =
fetchNotifications;
