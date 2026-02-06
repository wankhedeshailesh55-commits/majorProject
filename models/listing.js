const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cordinates: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  category: {
    type: String,
    enum: [
      "other",
      "trending",
      "rooms",
      "iconic cities",
      "mountain",
      "amazing pools",
      "camping",
      "farms",
      "arctic",
      "boats",
      "domes",
    ],
  },
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
