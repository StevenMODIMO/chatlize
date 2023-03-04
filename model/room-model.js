const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  room_name: String,
  room_creator: String,
  room_members: [String],
  room_chats: [
    {
      sender: String,
      thumbnail: String,
      message: String
    }
  ]
}, { timestamps: true});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;