const mongoose = require("mongoose");
require("dotenv").config();

const connectMango = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MongoDB_URL, { useNewUrlParser: true });
  console.log("connect");
};

module.exports = { connectMango };
