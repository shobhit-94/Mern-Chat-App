import asyncHandler from "express-async-handler";
import User from "../models/usersModel.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";

import dotenv from "dotenv";
import mongoose from "mongoose";
import message from "../models/messageModel.js";
const accessOne_on_OneChat = asyncHandler(async (req, res) => {
  try {
    // const { userid } = req.body; // // The person you want to chat with
    const { userid } = req.query; // // The person you want to chat with
    if (!userid) {
      return res
        .status(401)
        .json(new apiresponse(400, "useId is not sent with the request"));
    }

    //Step 1: Check if chat already exists

    let isGroupChat = await Chat.findOne({
      //   isGroupChat: true,
      //   _id:  userid ,
      //   users: { $elemMatch: { $eq: req.user._id } },
      $and: [
        { isGroupChat: true },
        { _id: userid },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
      .populate("users", "-password") //take all information not just id except password
      .populate("latestMessage"); //take all information of latest messafe
    if (isGroupChat) {
      //  return res.send(isChat[0]);
      return res
        .status(200)
        .json(
          new apiresponse(
            200,
            isGroupChat,
            "Group chat fetched successfully"
          )
        );
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } }, //Logged in user (you)
        { users: { $elemMatch: { $eq: userid } } }, //the perosn you want to chat with
      ],
    })
      .populate("users", "-password") //take all information not just id except password
      .populate("latestMessage"); //take all information of latest messafe

    //Step 2: If chat exists
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      //  return res.send(isChat[0]);
      return res
        .status(200)
        .json(new apiresponse(200, isChat[0], "Old chat fetched successfully"));
    } else {
      //crete new chat wit that user
      var createdChat = await Chat.create({
        chatName: "sender", //default name (will be replaced by UI later)
        isGroupChat: false,
        latestMessage: null,
        users: [req.user._id, userid], //store you and person you wants
        //  to chat with so that next time when you want to chat it with this person
        //  you can access the old chats
      });

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res
        .status(200)
        .json(new apiresponse(200, fullChat, "New Chat created successfully "));
    }
  } catch (error) {
    throw new apierror(
      401,
      error?.message || "Something went wrong while accessing th chats"
    );
  }
});
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }); // newest chat first
    if (result.length === 0) {
      return res.status(200).json(new apiresponse(200, [], "No chats found"));
    }
    // console.log("fetch chat idher tak");
    // console.log("result = ", result);
    return res
      .status(200)
      .json(new apiresponse(200, result), "Chats fetched successfully    ");
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          400,
          error?.message || "Something went wrong while fetching the chats"
        )
      );
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
  /*try {
    const messages = await Message.find({
      readBy: { $exists: true },
    });

    let updated = 0;

    for (let msg of messages) {
      if (!Array.isArray(msg.readBy) || msg.readBy.length === 0) continue;

      let changed = false;

      const updatedArray = msg.readBy.map((entry) => {
        changed = true; // because we always change it

        return {
          user: null,
          deliveredAt: null,
          seenAt: null,
        };
      });

      msg.readBy = updatedArray;

      await msg.save();
      updated++;
    }

    return res.json({ updated });
  } catch (error) {
    console.error("Error updating readBy:", error);
    return res.status(500).json("Internal error");
  }
*/
  const { ChatID } = req.query;

  const allChats = await Chat.find({});
  const result = await Promise.all(
    allChats.map(async (Chat_record) => {
      const latestMessageid = await Message.findOne({
        chat: Chat_record._id, // No need for new ObjectId, mongoose handles it
      })
        .sort({ createdAt: -1 })
        .select("_id");
      console.log("latestMessageid = ", latestMessageid);
      if (latestMessageid !== null) {
        const new_record = await Chat.findOneAndUpdate(
          Chat_record._id,
          {
            latestMessage: latestMessageid,
          },

          { new: true }
        );
        return {
          // chat: Chat_record,
          record: new_record,
        };
      }
    })
  );

  // console.log(result);
  // const allChats[0]
  // const latestMessageID = await Message.findOne({
  //   chat: new mongoose.Types.ObjectId(ChatID),
  // }).sort({ createdAt: -1 });
  // const update = await Chat.findByIdAndUpdate(
  //   new mongoose.Types.ObjectId(ChatID),
  //   {
  //     latestMessage: latestMessageID._id,
  //   },

  //   { new: true }
  // ).populate("latestMessage", "content");

  return res.status(200).json(new apiresponse(200, result, `successfully`));

  /*-----------
  try {
    const { users, name } = req.body;
    if (!users || !name) {
      return res
        .status(400)
        .json(new apiresponse(400, "Please fill all the fields"));
    }
    //NOTE users array ki form me hai isliye hm direct Chat model ke users[] me daldenge
    // nhi to agar string format me recived hota to pehle JSO.parse(users) se string to
    //array convert kerte
    //   let users_array = JSON.parse(users);
    let users_array = users;

    if (users_array.length < 2) {
      return res
        .status(400)
        .json(
          new apiresponse(
            400,
            "More than 2 users are required to form a group chat  "
          )
        );
    }

    users_array.push(req.user._id); //logged in user is also part of group chat

    const GroupChat = await Chat.create({
      chatName: name,
      users: users_array,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({
      _id: GroupChat._id,
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password");

    // console.log("fullGroupChat = ", fullGroupChat);
    return res
      .status(200)
      .json(
        new apiresponse(200, fullGroupChat, "full chat fetched successfully")
      );
  } catch (error) {
    return res
      .status(200)
      .json(
        new apierror(
          400,
          "Something went wrong while crating the groupt chat with the provided details"
        )
      );
  }*/
});
const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatName, newChatName } = req.body;

    if (!chatName || !newChatName) {
      return res
        .status(400)
        .json(
          new apierror(
            400,
            "PLease provide the complete details to rename the group"
          )
        );
    }

    const chatexist = await Chat.find({
      isGroupChat: true,
      users: { $elemMatch: { $eq: req.user._id } }, //Logged in user (you) present inside the users array or not
      //which ensures that this is the group created by you
    });

    if (!chatexist) {
      return res
        .status(400)
        .json(new apierror(400, "Failed to rename the group chat"));
    }
    // console.log("chatexist = ", chatexist);

    const updatedchat = await Chat.findByIdAndUpdate(
      chatexist[0]._id, //find humesha response array ki form me return kerta
      //  hai jiske 0th index pe humara data hota hai
      //vahi agar findOne() kerte to direct chatexist._id kerte
      { chatName: newChatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    // console.log("updatedchat = ", updatedchat);
    if (!updatedchat) {
      return res
        .status(400)
        .json(new apierror(400, "Failed to rename the group chat"));
    }

    // console.log("yaha pe hu rname ");
    return res
      .status(200)
      .json(
        new apiresponse(200, updatedchat, "Grup name changed successfully")
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(401, error?.message || "Failed to rename the group chat")
      );
  }
  /*
    isGroupChat: true → filters only group chats.

users: { $elemMatch: { $eq: req.user._id } } → checks if the logged-in user’s id exists in the users array.
    */
});
const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const { userid, OnlyAdmin } = req.body;

    if (OnlyAdmin) {
      //for only admin can remove
      const IsAdmin = await Chat.find({
        $and: [{ groupAdmin: req.user._id }, { isGroupChat: true }],
      });
      if (IsAdmin.length === 0) {
        return res
          .status(401)
          .json(new apierror(401, {}, "Only admin can remove from group"));
      }
    }
    if (!userid) {
      return res
        .status(401)
        .json(new apierror(401, {}, "Please provide the userid "));
    }
    const chatexist = await Chat.find({
      isGroupChat: true,
      $and: [
        // { groupAdmin: { $elemMatch: { $eq: req.user._id } } },
        { groupAdmin: req.user._id },
        { users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(userid) } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    //  console.log("userid = ", userid, "req.user._id = ", req.user._id);
    //   console.log("chatexist = ", chatexist);
    if (!chatexist || chatexist.length === 0) {
      const notPresent = (
        await User.findById(new mongoose.Types.ObjectId(userid))
      ).name;
      // console.log("error");
      return res
        .status(400)
        .json(
          new apierror(
            400,
            notPresent,
            `${notPresent} is not present in this group`
          )
        );
    }
    const deleteuser = await Chat.findByIdAndUpdate(
      chatexist[0]._id,
      { $pull: { users: new mongoose.Types.ObjectId(userid) } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("chatName")
      .populate("groupAdmin", "-password")
      .populate("isGroupChat", "-password");
    // console.log("deleteuser = ", deleteuser);
    const deletedUser = (
      await User.findById(new mongoose.Types.ObjectId(userid))
    ).name;
    return res
      .status(200)
      .json(
        new apiresponse(
          200,
          deletedUser,
          `${deletedUser} removed from chat group successfully`
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apiresponse(
          401,
          error?.message || "Failed to remove the person fromo chat group"
        )
      );
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { userids, OnlyAdmin } = req.body;
    const group = await Chat.findOne({
      $and: [
        { isGroupChat: true },
        {
          users: {
            $elemMatch: { $eq: new mongoose.Types.ObjectId(req.user._id) },
          },
        },
        { groupAdmin: new mongoose.Types.ObjectId(req.user._id) },
      ],
    });
    if (!group) {
      return res
        .status(401)
        .json(new apierror(401, {}, "Only admin can add to group"));
    }
    const groupid = group._id;
    // console.log("groupid is ", groupid);

    const resolveall = await Promise.all(
      userids.map(async (userid) => {
        const IsUserAlreadyPresent = await Chat.findOne({
          $and: [
            { isGroupChat: true },
            { _id: new mongoose.Types.ObjectId(groupid) },
            { users: { $elemMatch: { $eq: userid } } },
          ],
        });
        if (IsUserAlreadyPresent) {
          const NameofAlreadyPresentUser = (
            await User.findById(new mongoose.Types.ObjectId(userid))
          ).name;

          const data = { userid, NameofAlreadyPresentUser };
          const message = `${NameofAlreadyPresentUser} is already present in this group`;
          return res.status(401).json(new apierror(401, data, message));
        }
        return IsUserAlreadyPresent;
      })
    );
    // console.log("resolveall:", resolveall);
    if (OnlyAdmin) {
      //for only admin can add
      const IsAdmin = await Chat.findOne({
        $and: [
          { _id: new mongoose.Types.ObjectId(groupid) },
          { groupAdmin: req.user._id },
          { isGroupChat: true },
        ],
      });
      if (!IsAdmin) {
        return res
          .status(400)
          .json(new apierror(400, "Only admin can add to  group"));
      }
    }

    // const { userid } = req.body;

    if (!userids) {
      return res
        .status(401)
        .json(new apiresponse(401, "Please provide the complete details"));
    }

    const addedUsers = await Promise.all(
      userids.map(async (userid) => {
        const addedUser = await Chat.findByIdAndUpdate(
          new mongoose.Types.ObjectId(groupid),
          { $addToSet: { users: new mongoose.Types.ObjectId(userid) } },
          { new: true }
        )
          .populate("users", "-password")
          .populate("chatName")
          .populate("groupAdmin", "-password");

        if (!addedUser) {
          return res
            .status(400)
            .json(new apierror(400, `Failed to add user ${userid} to group`));
        }

        return addedUser; // ✅ must explicitly return
      })
    );

    const newuser = (
      await User.findById(new mongoose.Types.ObjectId(userids[0]))
    ).name;
    return res
      .status(200)
      .json(
        new apiresponse(200, newuser, `${newuser} added to group successfully`)
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          error?.message || "Failed to add the person to group chat"
        )
      );
  }
});
const whichUSerISPresentInGroup = asyncHandler(async (req, res) => {
  try {
    const group = await Chat.findOne({
      $and: [
        { isGroupChat: true },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    });

    if (!group) {
      return res
        .status(400)
        .json(new apierror(400, `Failed to fetch the group in Backend`));
    }
    // console.log("your group name is  = ", group.chatName);

    const allusers = await User.find();
    const allgroupuser = group.users;

    const Map_Already_Included_User = allusers.map((user) => ({
      value: user,
      iscommon: allgroupuser.includes(user._id) ? true : false,
    }));
    //  console.log(
    //   "This data included flag to detect all the users who are already present in the group = ",
    //   Map_Already_Included_User
    // );
    return res
      .status(200)
      .json(
        new apiresponse(
          200,
          Map_Already_Included_User,
          "This data included flag to detect all the users who are already present in the group"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          error?.message || "Failed to add the person to group chat"
        )
      );
  }
});
const DeleteAllChats = asyncHandler(async (req, res) => {
  try {
    const { chatID } = req.query;
    const Chats = await Chat.findOne({
      $and: [
        { _id: new mongoose.Types.ObjectId(chatID) },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    });

    if (!Chats) {
      return res
        .status(403)
        .json(new apierror(403, "You are not allowed to delete this chat"));
    }
    // console.log("your group name is  = ", group.chatName);

    // 2️⃣ Delete all messages in this chat
    const result = await Message.deleteMany({
      chat: new mongoose.Types.ObjectId(chatID),
    });
    return res
      .status(200)
      .json(
        new apiresponse(
          200,
          { deletedMessages: result.deletedCount },
          "All Data successfully Deleted"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new apierror(
          401,
          error?.message || "Failed to delete all chats of person"
        )
      );
  }
});

export {
  accessOne_on_OneChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  whichUSerISPresentInGroup,
  DeleteAllChats,
};
