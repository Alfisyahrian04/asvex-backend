const params =
new URLSearchParams(
window.location.search
);

const token =
params.get('token');

document
.getElementById(
'pay-button'
)
.addEventListener(
'click',
()=>{

snap.pay(token,{

onSuccess:function(){

alert(
'Pembayaran berhasil'
);

window.location.href =
'orders.html';

},

onPending:function(){

alert(
'Menunggu pembayaran'
);

},

onError:function(){

alert(
'Pembayaran gagal'
);

}

});

}
);
