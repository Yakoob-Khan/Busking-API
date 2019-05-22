import mongoose, { Schema } from 'mongoose';

// const bcrypt = require('bcryptjs');
// create a PostSchema with a title field
const UserSchema = new Schema({
  name: String,
  photo: String,
  sumOfRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  eventsHosted: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    //   match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  facebookProvider: {
    type: {
      id: String,
      token: String,
    },
    select: false,
  },

});

UserSchema.set('toJSON', {
  virtuals: true,
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/busking';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;
export default UserModel;
