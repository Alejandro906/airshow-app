const mongoose = require("mongoose");

const AirshowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  startTime : {
    type : String,
    required : true,
  },
  endTime : {
    type : String,
    required : true,
  },
  mainGate : {
    type : String,
    required : true,
  },
  secondaryGate : {
    type : String,
    required : true,
  },
  dateOfEvent : {
    type : String,
    required : true,
  },
  duration : {
    type : String, 
    required : true,
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket', // Reference to the Ticket model
  }],
});

module.exports = mongoose.model("Airshow", AirshowSchema);

/* ADD Main-Enterance, start-time, end-time, exitGate, entranceGate dateOfEvent to show in the viewInventory*/
