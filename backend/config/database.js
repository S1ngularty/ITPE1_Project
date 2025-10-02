const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.DB_URI).then((con) => {
    console.log(`mongoDB connected with host ${con.connection.host}`);
  });
};

module.exports = connectDB;
