import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  text: String,
  author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // eventCreator: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toJSON: {
    virtuals: true,
  },
});

// create model class
const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
