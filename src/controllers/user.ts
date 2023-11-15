import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import User from "../models/user";
import { user as UserType, user } from "../types/types"; // Renamed user type to UserType to avoid conflict
import { jwtMiddleware } from "../middleware/jwtMiddleware";
import * as jwt from "jsonwebtoken"; // Using ES6 import syntax for jwt
import * as dotenv from "dotenv";
dotenv.config();

const asyncHandler = require("express-async-handler");

function sanitizeInput(input) {
  // Implement input sanitization logic here
  // This could involve removing HTML tags, trimming, escaping special characters, etc.
  // For instance, using regex to remove HTML tags and trimming leading/trailing spaces:
  const sanitizedInput = input.replace(/<[^>]*>/g, "").trim();
  return sanitizedInput;
}

//@route is post /api/create
//@use create a user account
//@access op (assuming based on the route name)

const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      username,
      name,
      password,
      bio,
      email,
      profileImg,
      isVerify,
      isAdmin,
    } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }

    // Check for an existing user with the same email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      } else {
        return res
          .status(400)
          .json({ message: "User with this username already exists" });
      }
    }

    // Perform password strength validation
    // For example: Check if the password length is sufficient

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password should be at least 8 characters long" });
    }

    // Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      name,
      password: hashedPassword,
      bio,
      email,
      profileImg,
      isVerify,
      isAdmin,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating User:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route is post /api/create
//@use login a user account
//@access  open (assuming based on the route name)
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Sanitizing user inputs
    const sanitizedUsername = sanitizeInput(username);
    // You can sanitize the password similarly if needed

    // Check if the username exists in the database
    const existingUser = await User.findOne({ username: sanitizedUsername });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Password matches, user is authenticated
    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set the JWT token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@route is get /api/current
//@use get's user id from token
//@access on logged user
const currentUser = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.data);
  // return res.json({ userId:  });
  const userId = req.data.userId; // Assuming the user ID is passed as a parameter
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});

//@route is get /api/current
//@use get's user id from token
//@access only admin

const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users: user[] = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error Getting all user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a parameter
    const updatedFields: Partial<user> = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createUser, loginUser, currentUser, getAllUser, updateUser };
