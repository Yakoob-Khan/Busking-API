import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
  photo: String,
  sumOfRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  eventsHosted: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  stripeId: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

UserSchema.virtual('averageRating').get(function averageRatingCalc() {
  if (this.numberOfRatings === 0) {
    return 0;
  } else {
    return this.sumOfRating / this.numberOfRatings;
  }
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
