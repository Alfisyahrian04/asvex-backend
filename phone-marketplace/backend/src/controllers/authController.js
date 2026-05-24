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
}).select('+password');

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

if(
!req.user ||
!req.user._id
){
return res.status(401)
.json({
message:'Unauthorized'
});
}

const userId =
req.user._id;

let {
oldPassword,
newPassword
} = req.body;

oldPassword =
String(oldPassword || '').trim();

newPassword =
String(newPassword || '').trim();

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

if(
oldPassword === newPassword
){
return res.status(400)
.json({
message:
'Password baru tidak boleh sama dengan password lama'
});
}

const user =
await User.findById(
userId
).select('+password');

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

console.log(
'CHANGE PASSWORD ERROR:',
error
);

res.status(500)
.json({
message:error.message
});

}

};

/* PATCH START */

exports.addAddress =
async(req,res)=>{

try{

const user =
await User.findById(
req.user._id
);

user.addresses.push(req.body);

await user.save();

res.json(user.addresses);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.deleteAddress =
async(req,res)=>{

try{

const user =
await User.findById(
req.user._id
);

user.addresses =
user.addresses.filter(
item =>
item._id.toString()
!== req.params.id
);

await user.save();

res.json(user.addresses);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.setDefaultAddress =
async(req,res)=>{

try{

const user =
await User.findById(
req.user._id
);

user.defaultAddressId =
req.params.id;

user.addresses =
user.addresses.map(
item=>{

item.isDefault =
item._id.toString()
=== req.params.id;

return item;

}
);

await user.save();

res.json(user.addresses);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

/* PATCH END */
