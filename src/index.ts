import * as express from "express";

import * as bodyParser from "body-parser";
import * as userRoutes from "./routes/user";
// Import your user routes
import connectDB from "./config/connectDB";

const app = express();
const PORT = 3000; // Your desired port number

// MongoDB connection setup
connectDB();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoutes.router);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
