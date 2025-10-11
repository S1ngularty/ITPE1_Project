require("dotenv").config({path: "./config/.env"})
const App = require("./app");
const connectDB = require("./config/database");

connectDB();
const port = process.env.PORT || 8800;

App.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
