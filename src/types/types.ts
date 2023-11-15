import { SchemaDefinitionProperty } from "mongoose";

export interface user extends Document {
  username: string;
  name: string;
  password: string;
  bio?: string;
  email: string;
  profileImg?: string;
  isVerify: boolean;
  isAdmin: boolean;
  comments: string[] | SchemaDefinitionProperty<string[]>;
  userPosts: string[] ;
  likes: string[] | SchemaDefinitionProperty<string[]>;
}
