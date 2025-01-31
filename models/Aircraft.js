const mongoose = require("mongoose");
const AircraftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    wingspan: {
      type: Number,
      required: true, // in meters
    },
    range: {
      type: Number,
      required: true, // in kilometers
    },
    type: {
      type: String,
      enum: ["Fighter", "Bomber", "Passenger ", "Transport", "Civil"],
    },
    manufacturer: {
      type: String,
    },
    yearOfProduction: {
      type: Number,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    photos: {
      type: [String],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Aircraft", AircraftSchema);