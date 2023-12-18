import express = require("express");
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as userRoutes from "./routes/user";
import * as post from "./routes/post";
import connectDB from "./config/connectDB";
import imageUpload from "./routes/imageUpload";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as commnet from "./routes/commnet";

// console.log('Current working directory:', process.cwd());
// require('dotenv').config({ path: '/home/arin/bootcamp/full_stack/socail_media/backend/.evn' });

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadDirectory = "uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const app = express();
const PORT = 4000;

console.log(process.env.Email_USERNAME);

app.use(cors({ origin: '*' }));

// MongoDB connection setup
connectDB();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User Routes
app.use("/user", userRoutes.router);
// Post route

app.use("/post", post.router);

// comment on post route
app.use("/comment", commnet.router);

// Image upload route
app.use("/image", imageUpload);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Headers:", req.headers);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
