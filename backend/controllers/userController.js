const userService = require("../services/userService");

exports.userList = async (req, res) => {
  try {
    let result = await userService.userList();
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({
      message:
        "something went wrong while executing the operation on the server side",
      error,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    let result = await userService.getUser(req.user);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({
      message:
        "something went wrong while executing the operation on the server side",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await userService.update(req.user, req.body);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message:
        "something went wrong while executing the operation on the server side",
      error,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const result = await userService.updatePassword(req.user, req.body);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.userDelete = async (req, res) => {
  try {
    let result = await userService.userDelete(req.params);
    return res.status(200).json({ success: "true", result });
  } catch (error) {
    return res.status(500).json({
      message:
        "something went wrong whiles executing the operation on the server side!",
      error,
    });
  }
};
