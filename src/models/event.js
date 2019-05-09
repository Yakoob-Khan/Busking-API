import mongoose, { Schema } from 'mongoose';

const EventSchema = new Schema({
  title: String,
  imageURL: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  latitude: { type: Number, default: 0 },
  eventCreator: String
}, {
    toJSON: {
      virtuals: true,
    },
  });

EventSchema.virtual('score').get(function scoreCalc() {
  return this.upvotes - this.downvotes;
});

// create model class
const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;