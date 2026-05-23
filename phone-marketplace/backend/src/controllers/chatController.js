const Chat =
require('../models/Chat');

exports.sendMessage =
async(req,res)=>{

try{

const {
receiver,
message
} = req.body;

const chat =
await Chat.create({

sender:req.user._id,

receiver,

message

});

res.status(201)
.json(chat);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};

exports.getMessages =
async(req,res)=>{

try{

const receiverId =
req.params.receiverId;

const chats =
await Chat.find({

$or:[

{
sender:req.user._id,
receiver:receiverId
},

{
sender:receiverId,
receiver:req.user._id
}

]

})
.sort({
createdAt:1
});

res.json(chats);

}catch(error){

res.status(500)
.json({
message:error.message
});

}

};
