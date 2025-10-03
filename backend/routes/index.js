const auth = require("./auth");
const user = require("./userRoute");
const analyze = require("./analyze");

const allRoutes = {
  auth,
  user,
  analyze,
};

module.exports = allRoutes;
