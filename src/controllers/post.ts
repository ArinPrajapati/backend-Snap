import { Request, Response } from "express";
import User from "../models/user";
import Post from "../models/post";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

//get route to fetch all the posts
const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Fetch all the posts from the database
    const posts = await Post.find();
    // Return the posts as a response
    res.status(200).json(posts);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, userId, postMessage, postImg } = req.body;
    if (!userId && !postMessage && !title) {
      return res
        .status(400)
        .json({ message: "Please provide userId,title and postMessage" });
    }

    // user id validation
    const user = await User.findById(userId);
    console.log(user);
    console.log(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new post
    const newPost = new Post({
      userId,
      title,
      postMessage,
      postImg,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getByPostId = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ userId });
    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    // Check if the post exists
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post
    await existingPost.deleteOne();

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { title, postMessage, postImg } = req.body;

    // Check if the post exists
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post
    existingPost.postMessage = postMessage || existingPost.postMessage;
    existingPost.postImg = postImg || existingPost.postImg;
    existingPost.title = title || existingPost.title;

    // Save the updated post
    const updatedPost = await existingPost.save();

    res.status(200).json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Export the get route
export {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getByPostId,
  getPostUserId,
};
