import mongoose, { Schema } from 'mongoose';

const EventSchema = new Schema({
  title: String,
  description: String,
  imageURL: String,
  sumOfRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  latitude: { type: Number, default: 0 },
  address: String,
  eventCreator: String,
  // eventCreator: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toJSON: {
    virtuals: true,
  },
});

EventSchema.virtual('averageRating').get(function averageRatingCalc() {
  if (this.numberOfRatings === 0) {
    return 0;
  } else {
    return this.sumOfRating / this.numberOfRatings;
  }
});

// create model class
const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;
