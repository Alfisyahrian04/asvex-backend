const REVIEW_API =
'https://asvex-backend-production.up.railway.app/api/v1/reviews';

async function createReview(data){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
REVIEW_API,
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
'Failed create review'
);

}

return await response.json();

}

async function getProductReviews(productId){

const response =
await fetch(
`${REVIEW_API}/${productId}`
);

if(!response.ok){

throw new Error(
'Failed get reviews'
);

}

return await response.json();

}

window.createReview =
createReview;

window.getProductReviews =
getProductReviews;
