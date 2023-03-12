const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  room_avatar: String,
  room_name: String,
  room_creator: String,
  room_members: [{
    username: String,
    thumbnail: String,
    date: String
  }],
  room_chats: [
    {
      sender: String,
      thumbnail: String,
      message: String,
      date: String
    }
  ]
}, { timestamps: true});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
