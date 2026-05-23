const CHAT_API =
'https://asvex-backend-production.up.railway.app/api/v1/chat';

async function sendMessage(data){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
CHAT_API,
{
method:'POST',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify(data)
}
);

if(!response.ok){

throw new Error(
'Failed send message'
);

}

return await response.json();

}

async function getMessages(receiverId){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${CHAT_API}/${receiverId}`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

if(!response.ok){

throw new Error(
'Failed get messages'
);

}

return await response.json();

}

window.sendMessage =
sendMessage;

window.getMessages =
getMessages;
