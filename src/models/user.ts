import { model, Schema } from "mongoose";
import { user } from "../types/types";

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
    default: null,
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
  resetToken: {
    type: String,
    default: null,
  },
});

const UserModel = model<user>("User", userSchema);

export default UserModel;
