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

if(
!username ||
!email ||
!password
){

return res.status(400)
.json({
message:
'Lengkapi semua field'
});

}

if(
!email.includes('@')
){

return res.status(400)
.json({
message:
'Invalid email'
});

}

if(
!password ||
password.length < 6
){

return res.status(400)
.json({
message:
'Password minimal 6 karakter'
});

}

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

if(user.isBanned){

return res.status(403)
.json({
message:
'Akun dibanned'
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

exports.changePassword =
async(req,res)=>{

try{

const userId =
req.user._id;

const {
oldPassword,
newPassword
} = req.body;

if(
!oldPassword ||
!newPassword
){

return res.status(400)
.json({
message:
'Lengkapi semua field'
});

}

if(
newPassword.length < 6
){

return res.status(400)
.json({
message:
'Password minimal 6 karakter'
});

}

const user =
await User.findById(
userId
);

if(!user){

return res.status(404)
.json({
message:
'User tidak ditemukan'
});

}

const validPassword =
await bcrypt.compare(
oldPassword,
user.password
);

if(!validPassword){

return res.status(400)
.json({
message:
'Password lama salah'
});

}

const hashedPassword =
await bcrypt.hash(
newPassword,
10
);

user.password =
hashedPassword;

await user.save();

res.json({
message:
'Password berhasil diubah'
});

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
