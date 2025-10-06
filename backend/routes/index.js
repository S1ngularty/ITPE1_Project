const auth = require("./auth");
const user = require("./userRoute");
const analyze = require("./analyze");
const screw = require("./screwRoute");

const allRoutes = {
  auth,
  user,
  analyze,
  screw,
};

module.exports = allRoutes;
