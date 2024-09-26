const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Update with your frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

// User management
let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// Message handling
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  console.log(`A user is connected`);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
