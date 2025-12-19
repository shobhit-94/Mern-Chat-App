import asyncHandler from "express-async-handler";
import User from "../models/usersModel.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
dotenv.config();
``;
const sendMessage = asyncHandler(async (req, res) => {
  const { content, userid, isGroupChat, GroupChat_id } = req.body;
  try {
    // console.log("GroupChat_id = ", GroupChat_id);
    // console.log("userId = ", userid);
    // var chatId;
    var chatId = null;
    let createMessage;
    if (GroupChat_id && isGroupChat) {
      // console.log("if");
      //means it is GroupCHat then also check in which group i want to send message
      chatId = await Chat.findOne({
        $and: [
          { _id: new mongoose.Types.ObjectId(GroupChat_id) },
          { isGroupChat: true },
          { users: { $in: [req.user._id] } },
          //OR
          //{ users: { $elemMatch: { $eq: req.user._id } } },
          //OR
          //   { users: { $elemMatch: { $eq: userId } } },
          //   {
          //     users: { $eleMatch: { $eq: new mongoose.Types.ObjectId(userId) } },
          //   },
        ],
      }).populate("users", "_id name");
      // console.log("group Chat_id = ", chatId);
      const otherusers = chatId?.users.filter(
        //Isme to sabhi users aaenge group ke jinme se mai khud ko filter kar rha hu
        (u) => u._id.toString() !== req.user._id.toString() //isme find mat lagan nhi to ek hi user milega jo ki galat hai
      );
      // console.log("if otheruser =", otherusers);
      if (!chatId) {
        return res
          .status(401)
          .json(
            new apierror(401, chatId, `${chatId} is not found from backend`)
          );
      }
      const readByArray = otherusers.map((u) => ({
        user: u._id,
        seenAt: null,
        deliveredAt: new Date(),
      })); //isme sare other users ke id ka array ban jayega jinko message deliver karna hai
      createMessage = await Message.create({
        sender: req.user._id,
        content: content,
        chat: chatId,
        readBy: readByArray,
      });
    } else {
      // console.log("else me");
      chatId = await Chat.findOne({
        isGroupChat: false,
        $and: [
          // {users: { $elemMatch: { $eq: req.user._id }}},
          // {users: { $elemMatch: { $eq: userId }}},
          {
            users: {
              $all: [req.user._id, new mongoose.Types.ObjectId(userid)],
            },
          },
        ],
      }).populate("users", "_id name ");
      // console.log("no group Chat_id = ", chatId);
      const otheruser = chatId?.users.find(
        //isme find lagao kyuki hum oehle se hi pata hai one to one chat me bas opposite wala hi chhhiye
        (u) => u._id.toString() !== req.user._id.toString()
      );
      // console.log("else otheruser =", otheruser);

      if (!chatId) {
        return res
          .status(401)
          .json(
            new apierror(401, chatId, `${chatId} is not found from backend`)
          );
      }

      createMessage = await Message.create({
        sender: req.user._id,
        content: content,
        chat: chatId,
        readBy: [
          {
            user: otheruser._id,
            deliveredAt: new Date(),
            seenAt: null,
          },
        ],
      });
    }
    createMessage = await Message.findById(createMessage._id)
      // .populate("sender", "name email pic")
      // .populate(
      //   "chat",
      //   "isGroupChat chatName users groupAdmin createdAt updatedAt"
      // );

      .populate([
        {
          path: "sender",
          select: "name email pic createdAt updatedAt",
        },
        {
          path: "chat",
          select:
            "chatName isGroupChat users groupAdmin latestMessage createdAt updatedAt",
          populate: [
            {
              path: "users",
              select: "name email pic createdAt updatedAt",
            },
            {
              path: "groupAdmin",
              select: "name email pic",
            },
            {
              path: "latestMessage",
              select: "content sender createdAt",
              populate: {
                path: "sender",
                select: "name pic",
              },
            },
          ],
        },
      ]);
    // console.log("Created Message =", createMessage);
    if (!createMessage) {
      return res
        .status(401)
        .json(
          new apierror(
            401,
            createMessage,
            `message not created from sendMessage method in messageCOntroller inside backend `
          )
        );
    }

    await Chat.findOneAndUpdate(
      chatId._id,
      {
        latestMessage: createMessage._id,
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new apiresponse(200, createMessage, `Message sent Successfully`));
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          {},
          error?.message || "something from sendMessage method inside backend "
        )
      );
  }
});
const edit_message = asyncHandler(async (req, res) => {
  try {
    const { message_ID, new_content } = req.body;
    if (!message_ID) {
      return res
        .status(401)
        .json(new apiresponse(400, "message_ID is not sent with the request"));
    }

    const message_Edit = await Message.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(message_ID) },
      { $set: { content: `${new_content}` } },
      { new: true }
    );

    if (!message_Edit) {
      return res
        .status(401)
        .json(
          new apierror(
            400,
            message_Edit,
            "Failed to update the message in backend"
          )
        );
    }
    return res
      .status(200)
      .json(new apiresponse(200, message_Edit, `Message Updated Successfully`));
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          {},
          error?.message ||
            "something Wrong from edit_message method inside backend "
        )
      );
  }
});
const delete_message = asyncHandler(async (req, res) => {
  try {
    const { message_ID } = req.query;
    if (!message_ID) {
      return res
        .status(401)
        .json(new apiresponse(400, "message_ID is not sent with the request"));
    }

    const deletedMessage = await Message.findByIdAndDelete(message_ID);
    // console.log("deletedMessage = ", deletedMessage);
    const chat_id = deletedMessage.chat; //getting id of the chat so that we can update the latesmessage field in chatModel
    //otherwise in recenchats.jsx it will shown Unkwn content to left side chatBar of users

    if (!deletedMessage) {
      return res
        .status(404)
        .json(
          new apierror(
            404,
            "Failed to delete Message from delete_message method inside backend"
          )
        );
    }
    const latestChat = await Message.findOne({ chat: chat_id }).sort({
      createdAt: -1,
    });
    const update_latest_message_after_delete = // 🔹 Update chat.latestMessage safely
      await Chat.findByIdAndUpdate(
        chat_id,
        {
          latestMessage: latestChat ? latestChat._id : null, // if no messages left otherwise error comes in frontend
        },
        { new: true }
      )
        .populate("users", "name email pic")
        .populate("latestMessage", "content createdAt  updatedAt");

    if (!update_latest_message_after_delete) {
      return res
        .status(404)
        .json(
          new apierror(
            404,
            "Failed to update_latest_message_after_delete logic  inside backend"
          )
        );
    }

    console.log(
      "update_latest_message_after_delete = ",
      update_latest_message_after_delete
    );

    const myUserId = req.user._id.toString();
    // OR hardcode if testing:
    // const myUserId = "68c80ec69ec284b785c401fe";

    const chatObj = update_latest_message_after_delete.toObject();

    chatObj.users = chatObj.users.filter(
      (userId) => userId._id.toString() !== myUserId
    );
    console.log("chatObj = ", chatObj);

    return res
      .status(200)
      .json(
        new apiresponse(
          200,
          { latestMessage: chatObj },
          "Message deleted Successfully"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          {},
          error?.message || "something Wrong from delete method inside backend "
        )
      );
  }
});
// const read_By = asyncHandler(async (req, res) => {
//   try {
//     const { message_ID } = req.query;
//     if (!message_ID) {
//       return res
//         .status(401)
//         .json(new apierror(400, "message_ID  is not sent with the request"));
//     }
//     const ISPresent = await Message.findById(message_ID).content;
//     if (!ISPresent) {
//       return res
//         .status(401)
//         .json(
//           new apierror(
//             400,
//             "message  is not Present in the databse may be deleted"
//           )
//         );
//     }

//     const readByData = await User.findById(req.user._id).populate("");
//     const readby_name = await User.findById(readById).select("name");
//     // const readById = new mongoose.Types.ObjectId(req.user._id);
//     // const readby_name = await User.findById(readById).select("name");
//     const read = await Message.findByIdAndUpdate(
//       message_ID,
//       { $addToSet: { readBy: readById } },
//       { new: true }
//     );
//     if (!read) {
//       return res
//         .status(401)
//         .json(
//           new apierror(
//             400,
//             "Failed to add ReadbyId in readBy method inside backend"
//           )
//         );
//     }

//     return res
//       .status(200)
//       .json(
//         new apiresponse(
//           200,
//           read,
//           `Message read  Successfully by ${readby_name}`
//         )
//       );
//   } catch (error) {
//     return res
//       .status(401)
//       .json(
//         new apierror(
//           401,
//           {},
//           error?.message ||
//             "something Wrong from read_By method inside backend "
//         )
//       );
//   }
// });
const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const { chatid } = req.query;
    const chats = await Message.find({
      chat: new mongoose.Types.ObjectId(chatid),
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email pic")
      .populate("chat", "isGroupChat chatName users"); // <-- ADD THIS

    var users = null;
    if (!chats) {
      return res
        .status(401)
        .json(new apierror(400, "No chats found in backend fetchMessages"));
    }

    const otherPersons = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatid),
    });

    const you = new mongoose.Types.ObjectId(req.user._id);
    if (otherPersons.isGroupChat) {
      users = otherPersons.chatName + " Group";
    } else {
      // const temp1 = otherPersons.users.filter((user) => {
      //   if (user.toString() !== you.toString()) {
      //     //   console.log("user =", user);

      //     return user;
      //   }
      // });
      const otherPersonId = otherPersons.users.find(
        (id) => id.toString() !== you.toString()
      );
      const otherUser = await User.findById(otherPersonId);
      users = otherUser.name;
      // console.log("users =", otherUser.name);
    }

    return res
      .status(200)
      .json(
        new apiresponse(
          200,
          chats,
          `All Message between you  and ${users} Successfully fetch`
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          {},
          error?.message ||
            "something Wrong from fetchMessages method inside backend "
        )
      );
  }
});
const Alllatestmessage = asyncHandler(async (req, res) => {
  // const { All, Unread, Groups } = req.body;//because get request don't accept req.body in frontend
  const { All, Unread, Groups } = req.query;
  const messages = await Chat.find({
    users: { $in: [req.user._id] },
    latestMessage: { $ne: null },
  })
    .populate("users", "name email pic") // Populate user details only name and email
    .populate("latestMessage", "content createdAt updatedAt")
    .sort({ updatedAt: -1 });
  const result = messages
    //is reason se created at nahi likha kyuki created at bas jab fist chat create hui tab ka hai
    //lein updated at ka time har bar document chnage hone pe renew hota hai
    /*//code jiski maine bata kera
  // When a new message is sent to a chat
await Chat.findByIdAndUpdate(
  chatId, 
  { latestMessage: newMessageId }, // This updates the chat document
  { new: true }
);
// Result: updatedAt gets refreshed to current timestamp
// createdAt remains the same (original creation time)
  */
    .map((chat) => ({
      ...chat._doc,
      users: chat.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      ),
    }))
    .filter((chat) => chat.users.length > 0); // remove empty user lists

  // console.log("Result = ", result);

  return res
    .status(200)
    .json(
      new apiresponse(
        200,
        result,
        `latest Message between you  and  Successfully fetch`
      )
    );
});
const read_By = asyncHandler(async (req, res) => {
  const { chat_ID, message_ID, seen, delivered } = req.body;

  console.log("Request body received in read_By:", req.body);
  if (!chat_ID || !seen || !delivered) {
    console.log("chat_ID or seen or delivered may be  missing in the request");
    return res
      .status(401)
      .json(
        new apierror(
          400,
          "chat_ID or seen or delivered may be  missing in the request"
        )
      );
  }

  const getISOWithOffset = () => {
    const now = new Date();
    const iso = now.toISOString(); // 2025-11-05T08:11:31.533Z
    return iso.replace("Z", "+00:00");
  };

  if (seen && delivered) {
    console.log("means meesage is seen ");

    var message = await Message.findOne({
      chat: new mongoose.Types.ObjectId(chat_ID),
    })
      // .populate("chat", "users");
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: " _id name email pic",
        },
      });
    console.log("message = ", message);
    const me = message.chat.users.find(
      (u) => u._id.toString() === req.user._id.toString()
    );
    var readdetailObject = {
      // read_By_id: me.id,
      read_By_Name: me.name,
      read_By_Email: me.email,
      read_By_pic: me.pic,
    };
    const updateseen = message.readBy.find(
      (u) => u.user?.toString() === me.id?.toString()
    );
    console.log("updateseen =", updateseen);
    // updateseen.seenAt = getISOWithOffset();
    var temp = await Message.updateMany(
      {
        chat: message.chat._id,
        "readBy.user": me.id, // <---it matches the exact object in which user is me
        "readBy.seenAt": null, //set only if seenAt is null ..leave it if alrady set
      },
      {
        $set: {
          "readBy.$[elem].seenAt": getISOWithOffset(),
        },
      },
      {
        arrayFilters: [{ "elem.user": me._id, "elem.seenAt": null }],
        // arrayFilters: [{ "elem.seenAt": null }],
      },

      { new: true }
    );

    temp = message;
  } else if (!seen && delivered) {
    // console.log("means meesage is only delivered ");

    // message.readBy.user = new mongoose.Types.ObjectId(me.id);
    // message.readBy.deliveredAt = getISOWithOffset();
    var message = await Message.findById({
      _id: new mongoose.Types.ObjectId(message_ID),
    })
      // .populate("chat", "users");
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: " _id name email pic",
        },
      });
    console.log("message = ", message);
    const me = message.chat.users.find(
      (u) => u._id.toString() === req.user._id.toString()
    );
    var readdetailObject = {
      // read_By_id: me.id,
      read_By_Name: me.name,
      read_By_Email: me.email,
      read_By_pic: me.pic,
    };
    var temp = await Message.findOneAndUpdate(
      {
        _id: message_ID,
        "readBy.user": { $ne: me.id }, // <--- user not present? only then add
      },
      {
        $push: {
          readBy: {
            user: new mongoose.Types.ObjectId(me.id),
            deliveredAt: getISOWithOffset(),
            seenAt: null,
          },
        },
      },
      { new: true }
    );
    console.log("temp =", temp);
    console.log("readdetailObject =", readdetailObject);
    // message.readBy.push(readdetailObject);
    // await message.save();
  }

  if (!message) {
    return res
      .status(401)
      .json(new apierror(400, "message is not present may be deleted"));
  }
  return res
    .status(200)
    .json(
      new apiresponse(
        200,
        { reader: readdetailObject, message: message },
        `readby Testing response`
      )
    );
});

export {
  sendMessage,
  edit_message,
  delete_message,
  fetchMessages,
  Alllatestmessage,
  read_By,
};

/*
🔹 Common MongoDB Update Operators
Operator	Description	Example
$set	Updates the value of a field	{ $set: { content: "new text" } }
$unset	Removes a field	{ $unset: { content: "" } }
$push	Adds an element to an array	{ $push: { messages: newMessage } }
$pull	Removes an element from an array	{ $pull: { messages: { _id: msgId } } }
$addToSet	Adds an element to an array if it doesn’t exist	{ $addToSet: { tags: "important" } }
$inc	Increments a numeric field	{ $inc: { likes: 1 } }
*/
