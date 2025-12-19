import mongoose from "mongoose";
const messagesSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      //jaise mere or laddoo ki chat hu is id se "68c80ee39ec284b785c40201" se jo ki chat Model me _id hai vo yaha aeega
      //to jitni baar mai message likunga laddo ko new content ke sath to har bar message model me chat:"68c80ee39ec284b785c40201" me yahi id rahegi
      //jiski help se mai sare old message laddo ke sath ker hue fetch ker sakta hu
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    readBy: [
      //Which user(s) have read this message.
      //if one-one chat then only opposite user is present otheriwise in group chat multiple users can be present then
      //readBy array is helpul in that case
      {
        // _id: false, // disable auto _id for subdocuments
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        deliveredAt: { type: Date },
        seenAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);
const message = mongoose.model("messages", messagesSchema);
export default message;
