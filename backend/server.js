const App = require("./app");
const connectDB = require("./config/database");
const env = require("dotenv");

env.config({ path: "./.env" });
connectDB();
const port = process.env.PORT || 8800;

App.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
