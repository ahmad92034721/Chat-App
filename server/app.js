const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const cors = require("cors");

let onlineUsers = [];
// use auth controller  routers
app.use(
  cors()
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    console.log("user id: ", userId);
    socket.join(userId);
  });

  socket.on("send-message", (message) => {
    io.to(message.members[0]).to(message.members[1]).emit("receive-message", {
      chatId: message.chatId,
      sender: message.sender,
      text: message.text,
      read: message.read,
      createdAt: message.createdAt,
    });
    io.to(message.members[0]).to(message.members[1]).emit("set-message-count", {
      chatId: message.chatId,
      sender: message.sender,
      text: message.text,
      read: message.read,
      createdAt: message.createdAt,
    });
  });
  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });
  socket.on("user-typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });
  socket.on("user-logged-in", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }
    io.emit("online-users", onlineUsers);
  });
  socket.on("user-logged-out", (userId) => {
    onlineUsers.splice(onlineUsers.indexOf(userId), 1);

    io.emit("online-users", onlineUsers);
  });
});
module.exports = server;
