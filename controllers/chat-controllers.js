const Room = require("../model/room-model");

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
        console.log("You created this room");
      } else if (exists(members)) {
        console.log("User exists");
      } else {
        Room.findOneAndUpdate(
          { _id: roomName },
          {
            $push: {
              room_members: member,
            },
          },
          { new: true },
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json(result);
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
  Room.find({ room_members: { $in : [user]} }, (err, docs) => {
    res.status(200).json(docs)
  });
};

const deleteRoom = (req, res) => {
  const { id } = req.params;
  Room.findOneAndDelete({ id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json("Deleted");
    }
  });
};

const leaveRoom = (req, res) => {
  const { id } = req.params;
  const user = req.user.username
  Room.findOneAndUpdate({ id }, {
    $pull: { room_members: user }
  },
  { new: true},
  (err, result) => {
    if(err) {
      console.log(err)
    } else {
      res.json(result)
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
