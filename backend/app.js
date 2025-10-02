const express = require("express");
const App = express();
const cors = require("cors");

const { auth, user } = require("./routes/index");

App.use(cors());
App.use(express.json({ limit: "50mb" }));
App.use(express.urlencoded({ limit: "50mb", extended: true }));

// registered routes
App.use("/api/v1", auth);
App.use("/api/v1", user);
module.exports = App;
