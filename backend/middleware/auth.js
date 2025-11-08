require("dotenv").config();
let { expressjwt: jsonwebtoken } = require("express-jwt");
const jwt = require("jsonwebtoken");

exports.requireSignIn = jsonwebtoken({
  secret:"123123123",
  algorithms: ["HS256"],
});


exports.verifyToken = async (req, res, next) => {
const secret = process.env.JWT_SECRET;

  const auth = req.headers.authorization || "";
  if (!auth) return res.status(401).json("Unauthorized Access");

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json("invalid token");
  let payload =jwt.verify(token, secret, { algorithms: ["HS256"] });
  req.user = payload;

  next();
};

exports.checkForAuth = async (req, res, next) => {
const secret = process.env.JWT_SECRET;
  req.user=null
  const auth = req.headers.authorization || "";
  if (!auth) return next();

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json("invalid token");
  let payload =jwt.verify(token, secret, { algorithms: ["HS256"] });
  req.user = payload;

  next();
};

exports.checkRole =async(req,res,next)=>{
  if(role!== req.user.role) return res.status(403).json(`cant access this resource by ${role}`)


}
