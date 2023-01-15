const app = require("./app");
require("dotenv").config();
const { connectMango } = require("./db/connectMango");

const start = async () => {
  try {
    await connectMango();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log(`Server running. Use our API on port: 3000`);
  });
};

start();
