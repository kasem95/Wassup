import { MessageModel } from "./database/MessageSchema.js";
import { UserModel } from "./database/UserSchema.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join room", async (roomID, userName) => {
      console.log(userName + " has joined room " + roomID);
      await socket.join(roomID);
      io.to(roomID).emit(
        "greetings",
        userName + " has joined the room " + roomID
      );
    });
    socket.on("chat", async (message, user, send_date, chat) => {
      console.log(user + ": " + message + ": " + send_date);
      const message_obj = await MessageModel.create({
        message,
        chat,
        is_read: false,
        send_date,
        user,
      });
      io.to(chat).emit("send message", message_obj);
    });
    socket.on("leave room", async (roomID, userName) => {
      await socket.leave(roomID);
      io.to(roomID).emit("send message", userName + " has left the room");
      console.log(userName + " left the roomm " + roomID);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
