const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    roomName: String,
    roomCreator: String,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
