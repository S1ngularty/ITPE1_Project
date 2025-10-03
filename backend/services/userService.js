const User = require("../models/user");

exports.userList = async () => {
  let users = await User.find({}).sort({ createdAt: "ascending" }).exec();
  if (users.length < 0) throw new Error("there is no users in the database");
  return users;
};

exports.getUser = async (param) => {
  const { userId } = param;
  console.log(userId);
  let user = await User.findById(userId).exec();
  if (!user) throw new Error("User is not found in the database");

  return user;
};

exports.createUser = async (body) => {
  const { name, email, password } = body;
  const createdUser = await User.create({ name, email, password });
  if (!createdUser) throw new error("failed to create the user");
  return createdUser;
};

exports.update = async (user, body) => {
  const { userId } = user;
  const { name, email } = body;
  // console.log(userId,name,email)
  const currentUser = await User.findById(userId).exec();
  if (!currentUser)
    throw new Error(
      "failed to find the user on the database, Please try again later"
    );
  if (name) currentUser.name = name;
  if (email) currentUser.email = email;
  const saveUser = await currentUser.save();
  if (!saveUser) throw new Error("Failed to save the changes");
  return saveUser;
};

exports.updatePassword = async (userInfo, body) => {
  const { userId } = userInfo;
  const { password } = body;
  const user = await User.findById(userId).exec();
  if (!user) throw new Error("user not found");
  if (password) user.password = password.trim();
  await user.save();
  return user;
};

exports.userDelete = async (param) => {
  const { user } = param;
  const deletedUser = await User.deleteOne({ email: user }).exec();
  if (deletedUser.deletedCount === 0)
    throw new Error(
      "user does not exist to the database, please try again later"
    );
  return deletedUser;
};
