import { Model, Schema } from "./index.js";

const refreshTokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const RefreshToken = Model("RefreshToken", refreshTokenSchema);
