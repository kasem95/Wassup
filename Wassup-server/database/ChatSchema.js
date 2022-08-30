import { Schema, Model } from "./index.js";
import { UserSchema } from "./UserSchema.js";

export const ChatSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  title: { type: String, required: true },
  is_group: { type: Boolean, required: true },
});

export const ChatModel = Model("Chat", ChatSchema);
