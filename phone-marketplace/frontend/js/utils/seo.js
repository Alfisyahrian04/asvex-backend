function setSEO(
title,
description
){

document.title =
title;

const meta =
document.querySelector(
'meta[name="description"]'
);

if(meta){

meta.content =
description;

}

}

window.setSEO =
setSEO;
