const auth = require("./auth");
const user = require("./userRoute");
const analyze = require("./analyze");
const screw = require("./screwRoute");
const admin = require("./adminRoute")
const allRoutes = {
  auth,
  user,
  analyze,
  screw,
  admin
};

module.exports = allRoutes;
