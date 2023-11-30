import express = require("express");
import { createPost, deletePost, getAllPosts, getByPostId, getPostUserId } from "../controllers/post";
const router = express.Router();


router.get('/',getAllPosts)
router.get('/:id',getByPostId)
router.get('/user/:id',getPostUserId)
router.delete('/delete/:id',deletePost)
router.post('/create',createPost)


export { router };       