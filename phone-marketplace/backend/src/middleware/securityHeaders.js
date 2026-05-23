module.exports =
(req,res,next)=>{

res.setHeader(
'X-Frame-Options',
'DENY'
);

res.setHeader(
'X-Content-Type-Options',
'nosniff'
);

res.setHeader(
'Referrer-Policy',
'no-referrer'
);

next();

};
