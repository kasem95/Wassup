import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = 4000;
import http from "http";
const server = http.createServer(app);
import cors from 'cors'
import { UserModel } from "./database/UserSchema.js";
import { RefreshToken } from "./database/RefreshTokenSchema.js";
import { JWTService } from "./jwtService.js";

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/user/register", async (req, res) => {
  try {
    const request_user = req.body;
    console.log(request_user);
    const user = await UserModel.create(
      {
        username: request_user.username,
        password: request_user.password,
        display_name: request_user.display_name,
        email: request_user.email,
      },
      (err) => {
        if (err)
          return res.status(400).json({
            message: err.message,
          });
      }
    );
    return res.status(201).json({
      message: "Registered successfuly",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: err,
    });
  }
});

app.delete("/user/logout", async (req, res) => {
  try {
    const token = req.body.token;
    console.log(token);
    if (!token) return res.sendStatus(401);
    RefreshToken.deleteOne({ token }, (err) => {
      if (err) return res.sendStatus(403);
      return res.sendStatus(204);
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    if (data === null || data === undefined)
      return res.status(404).json({ message: "empty input" });
    const user = await UserModel.findOne({ ...data });
    if (!user) return res.status(403).json({ message: "invalid user" });
    console.log(user);
    const accessToken = JWTService.generateAccessToken(user.username);
    const refreshToken = JWTService.generateRefreshToken(user.username);
    await RefreshToken.create({ token: refreshToken });
    return res.status(200).json({ token: accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

app.post("/user/token", async (req, res) => {
  const token = req.body.token;
  if (!token) return res.sendStatus(401);
  const exists = await RefreshToken.findOne({ token });
  if (!exists) return res.sendStatus(403);
  JWTService.jwtVerfiy(token, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = JWTService.generateAccessToken(user);
    return res.status(201).json({ token: accessToken });
  });
});


server.on("error", (err) => {
  console.error(err.message);
});

server.listen(port, "key", () => {
  console.log("listening");
});
