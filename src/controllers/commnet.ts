import { Request, Response } from "express";
import * as dotenv from "dotenv";
// Assuming correct import path
import Comment from "../models/commet";
import Post from "../models/post";
import User from "../models/user";

// Load environment variables
dotenv.config();

const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, commentContent, userId } = req.body;

    if (!postId || !commentContent || !userId) {
      return res
        .status(400)
        .json({ message: "Please provide postId, comment, and userId" });
    }

    const postExist = await Post.findById(postId);
    if (!postExist) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const commentCreated = await Comment.create({
      postId,
      commentContent,
      userId,
    });

    if (!commentCreated) {
      return res.status(500).json({ message: "Failed to create comment" });
    }

    return res.status(201).json(commentCreated);
  } catch (error) {
    console.log("Error creating comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({ message: "Please provide postId" });
    }

    const postExist = await Post.findById(postId);
    if (!postExist) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ postId });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
    throw new Error("Failed to fetch comments");
  }
};

const getAllCommentsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "Please provide userId" });
    }

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    const comments = await Comment.find({ userId });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
    throw new Error("Failed to fetch comments");
  }
};



export { createComment , getAllCommentsByPostId ,getAllCommentsByUserId };
