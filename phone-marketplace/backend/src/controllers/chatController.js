const Chat =
require('../models/Chat');

exports.sendMessage =
async (req, res) => {

  const chat =
    await Chat.create({

      senderId:
        req.user._id,

      receiverId:
        req.body.receiverId,

      roomId:
        req.body.roomId,

      message:
        req.body.message

    });

  res.json({

    success: true,

    chat

  });

};

exports.getChats =
async (req, res) => {

  const chats =
    await Chat.find({

      roomId:
        req.params.roomId

    });

  res.json({

    success: true,

    chats

  });

};
