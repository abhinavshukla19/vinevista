require("dotenv").config();
const Jwt = require("jsonwebtoken");

const secret_key = process.env.Jwt_secret;

const authMiddleware = (req, res, next) => {
  // Accept both: token OR Authorization: Bearer <token>
  const token =
    req.headers.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is not available" });
  }

  try {
    const decode = Jwt.verify(token, secret_key);

    if (!decode || !decode.id) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    req.decode = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = { authMiddleware };
