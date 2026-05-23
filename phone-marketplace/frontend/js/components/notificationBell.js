async function loadNotificationCount(){

try{

const notifications =
await fetchNotifications();

const unread =
notifications.filter(
item => !item.isRead
);

const badge =
document.getElementById(
'notification-count'
);

if(!badge) return;

badge.innerText =
unread.length;

}catch(error){

console.log(error);

}

}

window.loadNotificationCount =
loadNotificationCount;
