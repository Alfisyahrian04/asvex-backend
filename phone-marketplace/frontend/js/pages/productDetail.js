protectPage();

const params =
new URLSearchParams(
window.location.search
);

const productId =
params.get('id');

const reviewList =
document.getElementById(
'review-list'
);

async function loadReviews(){

try{

const reviews =
await getProductReviews(
productId
);

renderReviews(
reviews
);

}catch(error){

console.log(error);

}

}

function renderReviews(reviews){

reviewList.innerHTML =
reviews.map(review=>`

<div class="review-card">

<h3>
${review.user?.username}
</h3>

<p>
⭐ ${review.rating}
</p>

<p>
${review.comment}
</p>

</div>

`).join('');

}

async function submitReview(){

try{

const rating =
document.getElementById(
'review-rating'
).value;

const comment =
document.getElementById(
'review-comment'
).value;

await createReview({

productId,
rating,
comment

});

alert(
'Review berhasil dikirim'
);

loadReviews();

}catch(error){

alert(
'Gagal kirim review'
);

}

}

loadReviews();
