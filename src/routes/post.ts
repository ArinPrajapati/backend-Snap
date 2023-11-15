import express = require("express");
import { createPost, deletePost, getAllPosts, getByPostId, getPostUserId } from "../controllers/post";
const router = express.Router();


router.get('/post',getAllPosts)
router.get('/post/:id',getByPostId)
router.get('/post/user/:id',getPostUserId)
router.delete('/delete/:id',deletePost)
router.post('/create',createPost)


export { router };