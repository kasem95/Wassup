import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = 3000;
import http from "http";
import { Socket, Server } from "socket.io";
import { ChatModel } from "./database/ChatSchema.js";
import { MessageModel } from "./database/MessageSchema.js";
const server = http.createServer(app);
import { UserModel } from "./database/UserSchema.js";
import { JWTService } from "./jwtService.js";
const io = new Server(server);
import ws_connect from "./webSocket.js";
import cors from "cors";

io.use(JWTService.authenticateUserSocket);
io.on("hgj", (socket) => {
  socket.on();
});
ws_connect(io);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(JWTService.authenticateUser);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user/get", async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData);
    const user = await UserModel.findOne({
      username:
        typeof userData.username === "string"
          ? userData.username
          : userData.username.username,
    });
    res.status(200).json({ user, message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error });
  }
});

app.get("/user", async (req, res) => {
  const users = await UserModel.find();
  console.log(users);
  return res.json({ users });
});

app.post("/chat/create", async (req, res) => {
  try {
    const data = req.body;
    const userData = req.user;
    const users = await UserModel.find({
      mobile: {"$in": data.users}
    });
    console.log('admin', userData)
    console.log(data);
    console.log(users);
    if (users.length === 0 || users.length !== data.users.length)
      return res.status(404).json({ message: "users don't have Wassup" });
    if (!data.is_group) {
      const existed_chat = await ChatModel.findOne({
        admin: {'$in': users.map(u => u._id)},
        users: users.map(u => u._id),
      });
      console.log('existed_chat', existed_chat)
      if (existed_chat)
        return res.status(200).json({ message: "exist", chat: existed_chat });
    }
    const chat_created = await ChatModel.create({
      admin: await UserModel.findOne({
        username:
          typeof userData.username === "string"
            ? userData.username
            : userData.username.username,
      }),
      users: users,
      title: data.is_group ? data.title : users[0].display_name,
      is_group: data.is_group,
    });
    return res.status(201).json({ message: "created", chat: chat_created });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err });
  }
});

app.get("/chat/get/all", async (req, res) => {
  const chats = await ChatModel.find();
  return res.status(200).json({ message: "ok", chats });
});

app.post("/chat/messages/get", async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.body.chat_id });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ messages: [] });
  }
});

app.post("/chat/details", async (req, res) => {
  try {
    const user_ids = req.body.user_ids;
    console.log(user_ids);
    const users = await UserModel.find({ _id: { $in: user_ids } });
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "failed to get users" });
  }
});

server.on("error", (err) => {
  console.error(err.message);
});

server.listen(port, "key", () => {
  console.log("listening");
});
