import express = require("express");
import { createComment, getAllCommentsByPostId, getAllCommentsByUserId } from "../controllers/commnet";
const router = express.Router();

router.post("/create", createComment);
router.get('/cuser/:id',getAllCommentsByUserId)
router.get('/cpost/:id',getAllCommentsByPostId)

export { router };