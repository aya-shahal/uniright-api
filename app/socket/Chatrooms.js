//   https://socket.io/docs/emit-cheatsheet/

let jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const io = new Server(global.server,{
  //pingInterval: 30000,
  //pingTimeout: 10000,
  //allowEIO3: true,
  //	transports:['websocket'],
  //cors:true,
  cors: {
    origin: "*",
    //	origin: "https://cb-react-frontend.azurewebsites.net/",
    //	methods: ["GET", "POST"],
    //allowedHeaders: ["my-custom-header"],
    //credentials: true
  }
});

//let io = require("socket.io").listen(global.server, {
 // pingInterval: 30000,
 // pingTimeout: 10000
//});
let chathelpers = require("./Chathelpers");
let PushNotification = require("../services/PushNotification");

//io.set('heartbeat interval', 30000);
//io.set('heartbeat timeout', 10000);


io.use(function(client, next) {
  console.log("socket trying to connect...",client.handshake.query.token)
  if (client.handshake.query && client.handshake.query.token) {
    jwt.verify(
      client.handshake.query.token,
      _config("jwt.secret"),
      { expiresIn: _config("jwt.expires") },
      function(error, decoded) {
        if (error) return client.disconnect();
        if (!decoded || decoded.status === 0) client.disconnect();

        client.user = decoded;
        //console.log("Verified ");

        User.findById(decoded._id, function(error, user) {
          if (error) return next(new Error("Authentication error"));
          if (!user) return next(new Error("Authentication error"));

          user.lastsocketid = client.id;
          user.save(function(error, user) {
            if (error) next(new Error("Authentication error"));
            next();
          });
        });
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async client => {
  const userid = client.user._id;
  console.log("connected userid :  " + userid);
  console.log("socket id :  " + client.id);

  //isonline
  let userinfo = await User.findById(userid).exec();
  if (userinfo && userinfo._id) {
    userinfo.isonline = true;
    await userinfo.save();
  }

  client.on("SendMessage", SendMessage);
  client.on("DeleteMessage", DeleteMessage);
  client.on("DeleteAllMessage", DeleteAllMessage);
  client.on("DeleteRoom", DeleteRoom);
  client.on("disconnect", async () => {
    //isonline
    let userinfo = await User.findById(userid).exec();
    if (userinfo && userinfo._id) {
      userinfo.isonline = false;
      await userinfo.save();
    }
    io.emit("message", "user disconnected");
  });
});

async function sendMessageReceived(
    currentsocket,
  lastsocketid,
  userid,
  roomtitle,
  msg,
  msgid,
  roomid,
  fullpicture,
  userlist,
  system,
  dataurl,
  type,
  msgdate = Date.now()
) {
  if (2>1) {
   // console.log("dataurl",fullpicture)
    /* sending to all user in  room(channel) except sender */
    let userinfo = await User.findById(userid).exec();
    let payload = {
      from: userid,
      fromname:userinfo.username,
      title: roomtitle, // room title
      message: msg,
      msgid: msgid,
      msgdate: msgdate,
      roomid: roomid,
      fullpicture:fullpicture,
      users:userlist,
      system:system,
      dataurl:userinfo.picture,
      msgtype:type,
    };
    console.log("broadcast")
    currentsocket.broadcast.to(roomid).emit("MessageReceived", payload);
  }else{
    console.log("seems offline")
  }
}

function sendMessageDeleted(
    lastsocketid,
    msgid,
    roomid,
) {
  if (io.sockets.connected[lastsocketid] != null) {
    /* sending to all user in  room(channel) except sender */
    let payload = {
      msgid: msgid,
      roomid: roomid,
    };
   // console.log(payload);
    io.sockets.connected[lastsocketid].emit("MessageDeleted", payload);
  }
}








async function DeleteRoom(message, callback) {
  console.log("DeleteMessage", message);
  let messgid = message.id;
  let roomid = message.roomid;
  let userid = this.user._id;
  let  roominfo = null
  if(roomid && roomid.length>1){
    roominfo = await Room.findById(roomid).lean().exec();
  }

  this.join(roomid);


  const recepientlist = roominfo.users ? roominfo.users.filter(i=>i.toString()!=userid.toString()):[]

  const fromuserinfo = await User.findById(userid).lean().exec();
  for (let i = 0, len = recepientlist.length; i < len; i++) {
    const recipientinfo = await User.findById(recepientlist[i])
        .lean()
        .exec();
    let roomtitle = roominfo.title;

    let roompicture =  _config("app.imageurl")+"/";
    let userlist = []
    roominfo.users.map(i=>{
      userlist.push({username:i.username,fullpicture:roompicture+i.picture})
    })
    if(!roominfo.isgroup && roominfo.users.length>1){
      roomtitle = fromuserinfo.username;
      roompicture += fromuserinfo.picture
    }else{
      roompicture += "group.png"
    }

    if (
        recipientinfo &&
        recipientinfo.lastsocketid &&
        io.sockets.connected[recipientinfo.lastsocketid] != null
    ) {

      if (io.sockets.connected[recipientinfo.lastsocketid] != null) {
        /* sending to all user in  room(channel) except sender */
        let payload = {
          status: "droom",
          roomid: roomid,
        };
        io.sockets.connected[recipientinfo.lastsocketid].emit("RoomInfo", payload);
      }

    }
  }




  await chathelpers.deleteAllMsg(roomid,true);

  callback({  status: 1 });
}
async function DeleteAllMessage(message, callback) {
  console.log("DeleteMessage", message);
  let messgid = message.id;
  let roomid = message.roomid;
  let userid = this.user._id;
  let  roominfo = null
  if(roomid && roomid.length>1){
    roominfo = await Room.findById(roomid).lean().exec();
  }

  this.join(roomid);

  await chathelpers.deleteAllMsg(roomid);
  const recepientlist = roominfo.users ? roominfo.users.filter(i=>i.toString()!=userid.toString()):[]

  const fromuserinfo = await User.findById(userid).lean().exec();
  for (let i = 0, len = recepientlist.length; i < len; i++) {
    const recipientinfo = await User.findById(recepientlist[i])
        .lean()
        .exec();
    let roomtitle = roominfo.title;

    let roompicture =  _config("app.imageurl")+"/";
    let userlist = []
    roominfo.users.map(i=>{
      userlist.push({username:i.username,fullpicture:roompicture+i.picture})
    })
    if(!roominfo.isgroup && roominfo.users.length>1){
      roomtitle = fromuserinfo.username;
      roompicture += fromuserinfo.picture
    }else{
      roompicture += "group.png"
    }

    if (
        recipientinfo &&
        recipientinfo.lastsocketid &&
        io.sockets.connected[recipientinfo.lastsocketid] != null
    ) {

      if (io.sockets.connected[recipientinfo.lastsocketid] != null) {
        /* sending to all user in  room(channel) except sender */
        let payload = {
          status: "dmessage",
          roomid: roomid,
        };
       // console.log(payload);
        io.sockets.connected[recipientinfo.lastsocketid].emit("RoomInfo", payload);
      }

    }
  }

  callback({  status: 1 });
}
async function DeleteMessage(message, callback) {
  console.log("DeleteMessage", message);
  let messgid = message.id;
  let roomid = message.roomid;
  let userid = this.user._id;
  let  roominfo = null
  if(roomid && roomid.length>1){
    roominfo = await Room.findById(roomid).lean().exec();
  }

  this.join(roomid);

  await chathelpers.deleteMsg(messgid);
  const recepientlist = roominfo.users ? roominfo.users.filter(i=>i.toString()!=userid.toString()):[]

  const fromuserinfo = await User.findById(userid).lean().exec();
  for (let i = 0, len = recepientlist.length; i < len; i++) {
    const recipientinfo = await User.findById(recepientlist[i])
        .lean()
        .exec();
    let roomtitle = roominfo.title;

    let roompicture =  _config("app.imageurl")+"/";
    let userlist = []
    roominfo.users.map(i=>{
      userlist.push({username:i.username,fullpicture:roompicture+i.picture})
    })
    if(!roominfo.isgroup && roominfo.users.length>1){
      roomtitle = fromuserinfo.username;
      roompicture += fromuserinfo.picture
    }else{
      roompicture += "group.png"
    }

    if (
        recipientinfo &&
        recipientinfo.lastsocketid &&
        io.sockets.connected[recipientinfo.lastsocketid] != null
    ) {
      sendMessageDeleted(
          recipientinfo.lastsocketid,
          messgid,
          roomid,
      );
    }
  }

  callback({  status: 1 });
}
async function SendMessage(message, callback) {
  let msg = message.text;
  let base64data = message.base64data;
  let type = message.msgtype;

  let roomid = message.roomid;
  let userid = this.user._id;

  let  roominfo = null
  if(roomid && roomid.length>1){
    roominfo = await Room.findById(roomid).lean().exec();
  }

  //console.log("roomid",roomid,userid)
  this.join(roomid);

  await chathelpers.addToRoom(userid,roomid)
  let messageinfo = await chathelpers.saveMessage(
      userid,
      roomid,
      msg,
      type,
      base64data,
  );


  const recepientlist = roominfo.users ? roominfo.users.filter(i=>i.toString()!=userid.toString()):[]

  console.log("recepientlist",recepientlist)
  const fromuserinfo = await User.findById(userid).lean().exec();
  for (let i = 0, len = recepientlist.length; i < len; i++) {
    const recipientinfo = await User.findById(recepientlist[i])
        .lean()
        .exec();

    let roomtitle = roominfo.title;
    let roompicture =  _config("app.imageurl")+"/";
    let userlist = []
    for (let i = 0, len = recepientlist.length; i < len; i++) {
     // console.log(i);
      const userfromroom = await User.findById(recepientlist[i])
          .lean()
          .exec();
      if(userfromroom){
        userlist.push({full_name:userfromroom.full_name,fullpicture:roompicture+userfromroom.picture})
      }else{
        console.log("usernote found",recepientlist[i])
      }

    }
    if(recepientlist.length>1){
      roomtitle = fromuserinfo.full_name;
      roompicture += fromuserinfo.picture
    }else{
      roompicture += "group.png"
    }

   // console.log("recipientinfo",io.sockets)

    if (
        recipientinfo &&
        recipientinfo.lastsocketid
       // io.sockets.connected[recipientinfo.lastsocketid] != null
    ) {
      sendMessageReceived(
          this,
          recipientinfo.lastsocketid,
          userid,
          roomtitle,
          msg,
          messageinfo._id,
          roomid,
          roompicture,
          userlist,
          messageinfo.system,
          messageinfo.dataurl,
          messageinfo.msgtype,
      );
    } else {
      // send push
      console.log("user not online send push")
      // send push
      if(recipientinfo){
        console.log("send push")
        if(!roominfo.isgroup){
          let userinfo = await User.findById(userid).exec();
          if(userinfo){
            roomtitle =  userinfo.full_name;
          }
        }else{
          let roominfo = await Room.findById(roomid).exec();

        }
        PushNotification.globalsend(recipientinfo.push.token,roomtitle,msg,"group",roomid)
        Notification.addNotification(true,userid,recipientinfo.id,msg,"user",userid);
      }
    }
  }

  // console.log("send callback of SendMessage event  ");
  // this.broadcast.to(roomid).emit('MessageReceived',payload );
 callback({ msgid: messageinfo._id,dataurl:messageinfo.dataurl, status: 1 });
}


global._io = io;
