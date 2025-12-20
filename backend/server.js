import express from "express";
import chats from "./data/data.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import userrouter from "./routes/userroutes.js";
import chatrouter from "./routes/chatroutes.js";
import messagerouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// dotenv.config({
//   // path: "./.env",
//   path: "/backend/.env",
// });
dotenv.config({
  path: path.resolve("./backend/.env"),
});
import { createServer } from "http";
import { Server } from "socket.io";
import http from "http";
import path from "path";
// import { ping } from "undici-types";

connectDB();
const app = express();
const server = http.createServer(app);
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server and Socket.IO running on port ${PORT}`.yellow.bold),
    console.log(process.env.NODE_ENV === "production", process.env.NODE_ENV);
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "https://mern-chat-app1-5utj.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
  },
});

io.on("connection", (socket) => {
  //socket==client//ye chiz server se aati hai  isline se  socket = io() jo ki frontend me hai ;
  // console.log(":Socket")
  console.log("🔌 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
  console.log("hello server");
  socket.on("Setup", (selectedUserId) => {
    //ye id aa ri hai recent recentchat  se
    socket.join(selectedUserId);
    console.log("User connected to socket.io with ID:", selectedUserId);
    socket.emit("connected");
  });
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("User joined room: " + chatId);
  });
  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    /*chat.users.map((user) => {
    if (user._id !== newMessageRecived.sender._id) {
        console.log("user._id",user._id,newMessageRecived)
        socket.in(user._id).emit("message recived",newMessageRecived);
      }
      return user
    });*/
    const chatid = newMessageRecived.chat._id;
    // console.log("chatid", chatid);
    console.log("newMessageRecived", newMessageRecived);
    // console.log("newMessageRecived", newMessageRecived);

    chat.users.forEach((user) => {
      // if (user._id === newMessageRecived.sender._id) return;
      if (user._id !== newMessageRecived.sender._id) {
        // console.log("user._id", user._id);
        // console.log("user", user);
        socket.in(chatid).emit("message recived", newMessageRecived);
      }
    });
  });
  socket.on("start typing", (TypingData) => {
    // console.log("TypingData received at server:", TypingData);
    const chatid = TypingData.chatId;
    var uniqueUser = null;
    if (Array.isArray(TypingData.oppsiteUserId)) {
      const oppositeIds = new Set(TypingData.oppsiteUserId.map((u) => u._id));
      uniqueUser = TypingData.users.find((u) => !oppositeIds.has(u._id));
      console.log("uniqueUser = ", uniqueUser);
    }
    // console.log("=== START TYPING EVENT RECEIVED ===");
    // console.log("Chat ID:", chatid);
    // console.log("Users in chat:", TypingData.users);
    // console.log("Opposite user:", TypingData.oppsiteUserId);

    TypingData.users.forEach((user) => {
      // console.log("Checking user:", user._id);
      // console.log("OppsiteUserId._id:", TypingData.oppsiteUserId?._id);
      var condition = false;
      if (!Array.isArray(TypingData.oppsiteUserId)) {
        //  console.log("if me aaya");
        condition = user._id === TypingData.oppsiteUserId._id;
      } else if (Array.isArray(TypingData.oppsiteUserId)) {
        console.log("else me aaya");

        condition = user._id !== uniqueUser._id;
      }

      // console.log(
      //   "Condition result (user._id === oppsiteUser._id):",
      //   condition
      // );

      if (condition) {
        console.log(">>> Condition TRUE. About to emit 'start typing'");
        socket.in(chatid).emit("start typing", TypingData);
        // console.log(">>> EMIT SENT to room:", chatid);
      }
    });
  });

  socket.on("stop typing", (TypingData) => {
    const chatid = TypingData.chatId;
    var uniqueUser = null;
    if (Array.isArray(TypingData.oppsiteUserId)) {
      const oppositeIds = new Set(TypingData.oppsiteUserId.map((u) => u._id));
      uniqueUser = TypingData.users.find((u) => !oppositeIds.has(u._id));
      console.log("uniqueUser = ", uniqueUser);
    }
    // var chat = TypingData.chat;
    TypingData.users.forEach((user) => {
      // console.log("OppsiteUserId._id:", TypingData.oppsiteUserId?._id);
      var condition = false;
      if (!Array.isArray(TypingData.oppsiteUserId)) {
        //  console.log("if me aaya");
        condition = user._id === TypingData.oppsiteUserId._id;
      } else if (Array.isArray(TypingData.oppsiteUserId)) {
        console.log("else me aaya");

        condition = user._id !== uniqueUser._id;
      }

      // console.log(
      //   "Condition result (user._id === oppsiteUser._id):",
      //   condition
      // );

      if (condition) {
        console.log(">>> Condition TRUE. About to emit 'stop typing'");
        socket.in(chatid).emit("stop typing", TypingData);
        // console.log(">>> EMIT SENT to room:", chatid);
      }
    });
  });
  socket.on("message seen", (messageSeenData) => {
    console.log("Message seen data received at server:", messageSeenData);
    const chaid = messageSeenData.message.chat._id;
    console.log("Message seen chat id =", chaid);
    messageSeenData.message.chat.users.forEach((user) => {
      if (user._id !== messageSeenData.sender) {
        console.log("user._id :", messageSeenData.message.sender);
        socket.in(chaid).emit("message seen ack", messageSeenData);
      }
    });
    //  socket.in(chaid).emit("message seen ack", messageSeenData);
  });
});

app.use(cookieParser());
app.use(
  cors({
    // origin:process.env.CORS_ORGIN,
    // origin: "http://127.0.0.1:3000",
    origin: [
      "https://mern-chat-app1-5utj.onrender.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    // origin:"https://localhost:8002",

    credentials: true,
  })
);
app.use(express.json()); //hum apne backend sever ko bata re hai ki json data accept kerna hai
app.use("/api/user", userrouter);
app.use("/api/chat", chatrouter);
app.use("/api/message", messagerouter);
console.log("ENV CHECK:", process.env.NODE_ENV);

// -------------------Deployment---------------
const __dirname1 = path.resolve();
console.log("ROUTE SETUP NODE_ENV =", JSON.stringify(process.env.NODE_ENV));
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV?.trim() === "production") {
  console.log("if me hu");
  const buildPath = path.join(__dirname1, "frontend", "build");
  console.log("Serving static from:", buildPath); // debug
  const buildPath2 = path.join(__dirname1, "..", "frontend", "build"); //ye wala path ChatApp ko chod de raha hai ye mat istmel karo resolve,res me bhi
  console.log("Serving static from:", buildPath2); // debug

  app.use(express.static(path.join(__dirname1, "frontend", "build")));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  console.log("else me hu");
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

// app.listen(port, console.log(`Server is listning on ${port} port`.yellow.bold));//it will not tun with socket.io
// ✅ Start the same HTTP server for both Express and Socket.IO

// app.get("/api/chats", (req, res) => {
//   res.send(chats);
//   //   res.send(chats[0]);
//   // res.send(chats[0].isGroupChat);
//   //   res.send(chats[0].users[1]);
// });
// app.get("/api/chats/:id", (req, res) => {
//   //   res.send(chats);
//   const singlechat = chats.find((c) => {
//     return c._id === req.params.id;
//   });
//   //   if (singlechat) res.send(singlechat);
//   res.json(singlechat || { message: "User not found" });
//   //   else {
//   //     console.log("not found");
//   //     throw new Error();
//   //   }
// });
