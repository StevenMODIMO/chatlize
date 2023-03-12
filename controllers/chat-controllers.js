const Room = require("../model/room-model");
const mongoose = require("mongoose");

const createNewRoom = (req, res) => {
  const roomName = req.body.roomName;
  const creator = req.user.username;
  const roomAvatar = roomName[0];
  Room.findOne({ room_name: roomName }, (err, result) => {
    if (result) {
      console.log("Room exists");
      return res.status(400).json({ error: "Room already taken" });
    } else {
      Room.create(
        {
          room_avatar: roomAvatar,
          room_name: roomName,
          room_creator: creator,
        },
        (err, result) => {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json(result);
          }
        }
      );
    }
  });
};

const joinRoom = (req, res) => {
  const roomName = req.body.joinedRoom;
  const member = req.user.username;
  if (!mongoose.Types.ObjectId.isValid(roomName)) {
    res.status(400).json({ error: "Invalid room id" });
  }
  Room.findOne({ _id: roomName }, (err, result) => {
    if (result) {
      const creator = result.room_creator;
      const members = result.room_members;
      const exists = (m) => {
        for (let i = 0; i < m.length; i++) {
          if (m[i] == member) {
            return true;
          }
        }
      };
      if (creator == member) {
        res.status(400).json({ error: "You created this room" });
      } else if (exists(members)) {
        res.status(400).json({ error: "User exists" });
      } else {
        const date = new Date();
        const day = date.getDay();
        const dat = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const getDayName = (day) => {
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return daysOfWeek[day];
        };
        const currentDate =
          getDayName(day) + "-" + dat + "/" + month + "/" + year;
        Room.findOneAndUpdate(
          { _id: roomName },
          {
            $push: {
              room_members: [
                {
                  username: member,
                  thumbnail: req.user.thumbnail,
                  date: currentDate,
                },
              ],
            },
          },
          { new: true },
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({ msg: "Successfully joined" });
            }
          }
        );
      }
    }
  });
};

const userRooms = (req, res) => {
  const user = req.user.username;
  Room.find({ room_creator: user }, (err, docs) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(docs);
    }
  }).sort({ createdAt: -1 });
};

const joinedRooms = (req, res) => {
  const user = req.user.username;
  Room.find({ room_members: { $in: [user] } }, (err, docs) => {
    res.status(200).json(docs);
  });
};

const deleteRoom = (req, res) => {
  const { id } = req.params;
  Room.findOneAndDelete({ id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ msg: "You deleted a room" });
    }
  });
};

const leaveRoom = (req, res) => {
  const { id } = req.params;
  const user = req.user.username;
  Room.findOneAndUpdate(
    { id },
    {
      $pull: { room_members: user },
    },
    { new: true },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ msg: `You left a room` });
      }
    }
  );
};

module.exports = {
  createNewRoom,
  joinRoom,
  userRooms,
  joinedRooms,
  deleteRoom,
  leaveRoom,
};
