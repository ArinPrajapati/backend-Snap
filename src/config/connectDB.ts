import * as dotenv from "dotenv";

dotenv.config();
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connnect = await mongoose.connect(process.env.MONGODB_CONN_STRING);
    console.log(
      "database connect: ",
      connnect.connection.host,
      connnect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
