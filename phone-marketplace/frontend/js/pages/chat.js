protectPage();

const params =
new URLSearchParams(
window.location.search
);

const receiverId =
params.get('user');

const messagesContainer =
document.getElementById(
'chat-messages'
);

const input =
document.getElementById(
'chat-input'
);

async function loadMessages(){

try{

const messages =
await getMessages(
receiverId
);

renderMessages(
messages
);

}catch(error){

console.log(error);

}

}

function renderMessages(messages){

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

messagesContainer.innerHTML =
messages.map(message=>`

<div class="
chat-message
${
message.sender ===
currentUser.id
? 'me'
: 'other'
}
">

${message.message}

</div>

`).join('');

messagesContainer.scrollTop =
messagesContainer.scrollHeight;

}

async function handleSendMessage(){

const message =
input.value.trim();

if(!message) return;

await sendMessage({

receiver:receiverId,

message

});

socket.emit(
'chat-message',
{
receiverId
}
);

input.value = '';

loadMessages();

}

socket.on(
'new-chat-message',
()=>{

loadMessages();

});

loadMessages();
