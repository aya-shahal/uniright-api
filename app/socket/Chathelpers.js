//let uuidv4 = require("uuid/v4");
const { v4: uuidv4 } = require('uuid');

let ImageManager = require("../helpers/ImageManager");
let fs = require("fs");
 const Chathelpers = {
     saveMessage: async function(
    userid,
    roomid,
    msg,
    type="text",
    base64data=""
  ) {
    //console.log("save message", userid, roomid, msg);
    let message = new Message();
    message.user = userid;
    message.room = roomid;
    message.text = msg;
    message.msgtype = type;
    if(type!="text"){
        message.filename =  await ImageManager.uploadimagebase64row(base64data,type=="image"?"png":"mp3")
    }
    await message.save();

    return message;
  },


  prepareRoomMessage: async function(room,userid) {
      const users = room.users;
      let fullpicture = _config("app.imageurl")+"/";
      if(!room.isgroup && users.length>1){
          const chatwith = users.filter(i=>i._id!=userid)[0]
          if(chatwith){
              room.title = chatwith.full_name
              room.recipientid = chatwith._id;
              fullpicture +=chatwith.picture;
          }

          room.totaluser=users.length;
          let userlist = []
          users.map(i=>{
              userlist.push({full_name:i.full_name,fullpicture:fullpicture+i.picture})
          })
          room.userlist=userlist;

      }else{
          room.recipientid = "";
          room.userlist=[];
          fullpicture +="group.png";
      }

      room.fullpicture = fullpicture
      room.roomid=room._id;
      let messages = await Message.find({ room: room._id }).populate("user").sort({ $natural: -1 }).lean({virtuals:true}).limit(10).exec();
     // console.log(messages)
      const countmessages = await Message.countDocuments({ room: room._id }).exec();

     // if(countmessages>messages.length){
       //   let loadmoremsg = await Message.createLoadMore(room._id);
        //  messages.push(loadmoremsg);
     // }
      room.messages = messages.reverse();
      // add load more message
      room.lastmsg=messages.length>0 ?messages[messages.length-1].text:" ";
      room.time=messages.length>0 ?messages[messages.length-1].updatedAt:room.updatedAt;
      return room;
  },

  saveRoom: async function(senderid, recipientid) {

      let roominfo= await Room.findOne({
                 $and: [
                     { users: { "$all" : [senderid]} },
                     { users: { "$all" : [recipientid]} }
                 ],
             }).lean().exec();


      if(!roominfo){
          roominfo = new Room();
          let users = [];
          users.push(senderid);
          if (recipientid && recipientid.length > 3) {
              users.push(recipientid);
          }
          roominfo.users = users;
          roominfo.admins = [senderid];
          await roominfo.save();
          console.log("room created")
      }else{
          console.log("room alreadyfound")
      }

    return await Room.findById(roominfo._id).populate("users admins").lean({virtuals:true}).exec();
  },

    createSystemMessage: async function(roomid, msg) {
        console.log("createSystemMessage ", roomid, msg);
        let message = new Message();
        message.room = roomid;
        message.text = msg;
        message.system = true;
        await message.save();
        return message;
    },

     forwardMessage: async function(roomid, msgid) {
         console.log("forwardMessage to room",  roomid);
         let oldMsg = await Message.findById(msgid).lean().exec();
         oldMsg._id = undefined
         let message = new Message(oldMsg);
         message.room = roomid;
         message.forward = true;
         await message.save();
         return message;
     },

     kickuserFromRoom: async function(userid,roomid, kickuserid) {

         let room = await Room.findById(roomid).exec();
         if (room) {
             let users = room.users;

             console.log("kickuserFromRoom room ",users,kickuserid);
             const userFiltered = users.filter(element => {
                 return element != kickuserid;
             });
             console.log("kickuserFromRoom room ",userFiltered);

                 room.users = userFiltered;


             await room.save();
             console.log("user added to room " + room.title);
         }else{
             console.log("room not found")
         }





         Chathelpers.createSystemMessage(userid, roomid, "Admin Kicked User");
         return room._id;
     },


     addToRoom: async function(userid, roomid) {

    let room = await Room.findById(roomid).exec();
    if (room) {
      let users = room.users;
       // console.log("addToRoom room ",users,userid);
      const found = users.find(element => {
        return element.toString() == userid.toString();
      });
      if (!found) {
        users.push(userid);
        room.users = users;
          await room.save();
      }else{
        console.log("already found ")
      }
    }else{
        console.log("room not found")
        return null;
    }


    return room._id;
  },

     exitFromRoom: async function(userid, roomid) {

         let room = await Room.findById(roomid).exec();
         if (room) {
             let users = room.users;
             // console.log("addToRoom room ",users,userid);
             const updatedfound = users.filter(element => {
                 return element.toString() != userid.toString();
             });
                 room.users = updatedfound;
                 await room.save();
         }else{
             console.log("room not found")
             return null;
         }


         return room._id;
     },

     deleteMsg: async function(msgid) {
         let msg = await Message.findById(msgid).exec();
         if (msg) {
             await msg.remove();
         }
     },
     deleteAllMsg: async function(roomid,deleteroom = false) {
         console.log("deleete all msg ",roomid)
         await Message.deleteMany({room:roomid}).exec();
         if(deleteroom){
             let items = await Room.findById(roomid).exec();

             if(items){
                 await items.remove();
             }
         }
     }
};


module.exports = Chathelpers
