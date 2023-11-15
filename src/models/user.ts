import { model, Schema } from "mongoose";
import { user } from "../types/types";

interface IUser extends Document {
  // Other properties...
  userPosts: string[]; // Assuming userPosts is an array of post IDs (strings)
}

const userSchema = new Schema<user>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImg: {
    type: String,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: "Post",
    default: [],
  },
  userPosts: [{ type: Schema.Types.ObjectId, ref: "Post",default: [] }],

  likes: {
    type: [Schema.Types.ObjectId],
    ref: "Post",
    default: [],
  },
});

const UserModel = model<user>("User", userSchema);

export default UserModel;
