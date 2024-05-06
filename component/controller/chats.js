const mongoose = require("mongoose");
const Chats = mongoose.model("Chats");
const jwt = require("jwt-then");

function generateResponse(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = 200;

    // for (let i = 0; i < length; i++) {
    //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
    // }
    
    return Array(200).join().split(',').map(function() { return characters.charAt(Math.floor(Math.random() * characters.length)); }).join('');
    ;
  }

exports.add = async (req, res) => {
  try{
  const {  name, user, token, message,chatId } = req.body;
// program to generate random strings
let chatExist
// const result = Math.random().toString(36).substring(2,7);
  const reply = generateResponse()

  if(!token){
    res.json({
        message:reply,
        length:reply.length
      });
      return
  }
  if(chatId)    chatExist = await Chats.findOne({ _id: chatId });

  if (chatExist ) {
    await Chats.updateOne(
        { _id: chatId },
        {
          $push:
          {
            chats:{
                $each:[
                    {
                        message
                    },
                    {
                        message:reply,
                        bot:true
                    }
                ]
            }
          }
        }
      )

    res.json({
      message:reply,
      chatId: chatExist.id
    });
    return
  }
  const decoded = await jwt.verify(token, 'dskfjslkdjfm2');

  var userId = new mongoose.Types.ObjectId(decoded.id)
  const chat = new Chats({
    name: name,
    userId,
    title:message,
    chats:[
        {
            message
        },
        {
            message:reply,
            bot:true
        }
    ]

  });

  await chat.save();
//   console.log(chat)
  res.json({
    message: reply,
    chatId: chat['_id']
});
  }
  catch(err){
    console.log("error on app creating ", err)
  }
};

exports.getChat = async (req, res) => {
  try {
    const { token, chatId } = req.body;
    const chatExist = await Chats.findOne({
      $and:[
       { _id:chatId }
      ]
      
    });
    if(chatExist){
      const decoded = await jwt.verify(token, 'dskfjslkdjfm2');
      // console.log(decoded, chatExist)
      if (decoded ) {
        if((decoded.id == chatExist.userId )){
        res.json({
          data: chatExist,
          status:true,
        });
      }
      else if(chatExist.shared){
        res.json({
          data: chatExist,
          status:true,
          shared:true
        });
      }
      else{
        res.json({
          status:false,
          message: 'You are not authorised for this chat.'
        })
      }
      }
      else{
        res.json({
          status:false,
          message: 'You are not authorised for this chat.'
        })
      }
      

  }else{
    res.json({
      status:false,
      message: 'Chat does not exists'
    })
  }
  }
  catch (err) {
    console.log(err)

    return res.status(401).send("Invalid Token");

  }
}


exports.allChats = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await jwt.verify(token, 'dskfjslkdjfm2');
    // console.log(decoded)
    const chatExist = await Chats.find({
      userId: new mongoose.Types.ObjectId(decoded.id)
    }, {title:1, createdAt:1}).sort( { createdAt : -1 } )
    res.json({
      data: chatExist
    });
  }
  catch (err) {
    return res.status(401).send("Invalid Token");

  }
}

exports.enableShare = async (req, res) => {
  try {
    const { chatId, token } = req.body;
    // console.log(decoded)
    const decoded = await jwt.verify(token, 'dskfjslkdjfm2');

    let chatExist;
    if(chatId)    chatExist = await Chats.findOne({ _id: chatId });

    if(chatExist && decoded.id == chatExist.userId){
        await Chats.updateOne(
          { _id: chatId },
          {
            $set:
            {
              shared:true
            }
          }
        )
      
      res.json({
        data: chatExist
      });
    }
      else{
        res.json({
          status:false,
          message: 'Not authorised to enable share.'
        });
      }

  }
  catch (err) {
    return res.status(401).send("Invalid Token");

  }
}

exports.addSharedChat = async (req, res) => {
  try {
    const { chatId, token } = req.body;
    // console.log(decoded)
    let chatExist;
    if(chatId)    chatExist = await Chats.findOne({ _id: chatId });
    else{
      return res.status(401).send("Invalid ChatId");

    }
    const decoded = await jwt.verify(token, 'dskfjslkdjfm2');

    var userId = new mongoose.Types.ObjectId(decoded.id)
    const chat = new Chats({
      name: chatExist.name,
      userId,
      title:chatExist.title,
      chats:chatExist.chats
  
    });
  
    await chat.save();
    
    res.json({
      chatId: chat['_id'],
      status:true
    });
  }
  catch (err) {
    return res.status(401).send("Invalid Token");

  }
}
