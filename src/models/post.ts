import { Schema, model } from "mongoose";

interface Like {
  userName: string;
  userId: string;
}

interface Comment {
  userName: string;
  userId: string;
  comment: string;
}

interface SocialMediaPost {
  userId: string;
  postMessage: string;
  postImg?: string;
  comments: Comment[];
  likes: Like[];
  title: string;
  TimeStamp: Date;
}

const socialMediaPostSchema = new Schema<SocialMediaPost>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  postMessage: {
    type: String,
    required: true,
  },
  postImg: {
    type: String,
  },
  comments: [
    {
      userName: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  likes: [
    {
      userName: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },
  ],
  TimeStamp: {
    type: Date,
    default: Date.now,
  },
});

const SocialMediaModel = model<SocialMediaPost>(
  "SocialMedia",
  socialMediaPostSchema
);

export default SocialMediaModel;
