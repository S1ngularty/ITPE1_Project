const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log(email, password);
    if (!password || !email)
      return res.status(500).json("please provide input on the fields");
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) return res.status(500).json("email not found");
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json("password dont match");

    const token = jwt.sign(
      { email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    if (!token)
      return res
        .status(500)
        .json("Couldnt generate a token, Please try again!");

    return res.status(200).json({ token, email });
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message);
  }
};

exports.register = async (req, res) => {
  let { name, email, password } = req.body;

  const user = (await User.create({ name, email, password })).save();
  if (user) return res.status(201).json(user);
  return res.status(500).json("error occured");
};
