const bcrypt =
require('bcryptjs');

const User =
require('../models/User');

const generateToken =
require('../utils/generateToken');

exports.register =
async(req,res)=>{

try{

const {
username,
email,
password,
role,
adminKey
} = req.body;

const emailExists =
await User.findOne({
email
});

if(emailExists){

return res.status(400)
.json({
message:
'Email already used'
});

}

const usernameExists =
await User.findOne({
username
});

if(usernameExists){

return res.status(400)
.json({
message:
'Username already used'
});

}

if(role === 'admin'){

if(
adminKey !==
process.env.ADMIN_SECRET_KEY
){

return res.status(403)
.json({
message:
'Invalid admin key'
});

}

}

const hashedPassword =
await bcrypt.hash(
password,
10
);

const user =
await User.create({

username,
email,
password:
hashedPassword,
role

});

const token =
generateToken(user);

res.status(201)
.json({

token,

user:{

id:user._id,
username:user.username,
email:user.email,
role:user.role

}

});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.login =
async(req,res)=>{

try{

const {
email,
password
} = req.body;

const user =
await User.findOne({
email
});

if(!user){

return res.status(400)
.json({
message:
'Invalid credentials'
});

}

const validPassword =
await bcrypt.compare(
password,
user.password
);

if(!validPassword){

return res.status(400)
.json({
message:
'Invalid credentials'
});

}

const token =
generateToken(user);

res.json({

token,

user:{

id:user._id,
username:user.username,
email:user.email,
role:user.role

}

});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
