import { Schema, Model } from "./index.js";
import { UserSchema } from "./UserSchema.js";

export const MessageSchema = new Schema({
  message: { type: String, required: true },
  send_date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  is_read: { type: Boolean, required: true },
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
});

export const MessageModel = Model("Message", MessageSchema);
