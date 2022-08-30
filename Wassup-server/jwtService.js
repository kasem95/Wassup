import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign({ username: user }, process.env.SECRET_KEY, {
    expiresIn: '20m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ username: user }, process.env.REFRESH_SECRET_KEY);
};

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    return next();
  });
};

const authenticateUserSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) next(new Error("unauthorized"));
      else next();
    });
  } else {
    console.log("authenticateUserSocket", "error");
    next(new Error("forbidden"));
  }
};

const authenticateUserPacket = (packet, next) => {
    
    console.log(packet);
    console.log('packet');
};

export const JWTService = {
  authenticateUser,
  authenticateUserSocket,
  generateAccessToken,
  generateRefreshToken,
  jwtVerfiy: jwt.verify,
  authenticateUserPacket
};
