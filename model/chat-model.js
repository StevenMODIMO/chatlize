const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomName: String,
  members: [String],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
