import * as express from "express";
import { v2 as cloudinary } from "cloudinary";
import * as multer from "multer";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as userRoutes from "./routes/user";
import * as post from "./routes/post";
import connectDB from "./config/connectDB";
import imageUpload from "./routes/imageUpload";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as commnet from "./routes/commnet";

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
const PORT = 3000;

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:5173", // specify the allowed origin
  methods: "GET,POST,PUT,DELETE", // specify the allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // specify the allowed headers
};

app.use(cors(corsOptions));

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
