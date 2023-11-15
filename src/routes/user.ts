import express = require("express");
const router = express.Router();

import { jwtMiddleware } from "../middleware/jwtMiddleware";
import {
  createUser,
  currentUser,
  getAllUser,
  loginUser,

  // upadateUser
} from "../controllers/user";

router.get("/all", getAllUser);

router.post("/create", createUser);

router.post("/login", loginUser);

// router.put("/upadate", upadateUser);

router.get("/current", jwtMiddleware, currentUser);

export { router };
