const Room = require("../model/room-model");


const createNewRoom = (req, res) => {
    const roomName = req.body.roomName;
  const creator = req.user.username;
  Room.findOne({ room_name: roomName }, (err, result) => {
    if (result) {
      console.log("Room exists");
      return res.status(400).json({ error: "Room already taken" });
    } else {
      Room.create({
        room_name: roomName,
        room_creator: creator,
      }, (err, result) => {
        if(err) {
          res.status(400).json(err)
        } else {
          res.status(200).json(result)
        }
      });
    }
  });
}

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
                res.status(200).json(result)
              }
            }
          );
        }
      }
    });
}

const userRooms = (req, res) => {
    const user = req.user.username
  Room.find({ room_creator: user}, (err, docs) => {
    if(err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(docs)
    }
  }).sort({ createdAt: -1 })
}

const joinedRooms = (req, res) => {
    const user = req.user.username
  const json_rooms = []
  const chats = []
  Room.find({ room_creator: { $ne: user }}, (err, docs) => {
    docs.map(room => {
      const mems = room.room_members
      for(let i = 0; i < mems.length; i++) {
        if(mems[i] == user) {
          json_rooms.push(room.room_name)
        }
      }
      chats.push(room.room_chats)
    })
   res.status(200).json({json_rooms, chats})
  })
}

const deleteRoom = (req, res) => {
    const { id }= req.params
  Room.findOneAndDelete({ id }, (err, result) => {
    if(err) {
      console.log(err)
    } else {
      res.status(200).json("Deleted")
    }
  })
}

const leaveRoom = (req, res) => {
    
}