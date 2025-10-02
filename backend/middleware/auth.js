require("dotenv").config();
let { expressjwt: jsonwebtoken } = require("express-jwt");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

exports.requireSignIn = jsonwebtoken({
  secret,
  algorithms: ["HS256"],
});

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  if (!auth) return res.status(401).json("Unauthorized Access");

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json("invalid token");
  console.log(token)
  let payload =jwt.verify(token, secret, { algorithms: ["HS256"] });
  console.log(payload);
  req.user = payload;

  next();
};
