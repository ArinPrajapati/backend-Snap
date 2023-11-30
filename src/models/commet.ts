import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  commentContent: string;
  postId: string;
  userId: string;
  timestamp: Date;
}

const commentSchema: Schema = new Schema({
  commentContent: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'socialmedias', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
