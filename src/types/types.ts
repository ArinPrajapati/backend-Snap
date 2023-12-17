import { SchemaDefinitionProperty } from "mongoose";

export interface user extends Document {
  _id?: any;
  resetToken: string | null;
  username: string;
  name: string;
  password: string;
  bio?: string;
  email: string;
  profileImg?: string;
  isVerify: boolean;
  isAdmin: boolean;
}
  