const Chat = require("../model/chat-model");
const router = require("express").Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("chat", { user: req.user });
});

// Create a room in the database
router.post("/", authCheck, async (req, res) => {
  const data = req.body.roomName;
  console.log("Room created is: ", data);
  try {
    const newRoom = data;
    const createdRoom = await Chat.create({ roomName: newRoom, roomCreator: req.user.username });
    console.log(createdRoom)
  } catch (error) {
    console.log(error);
  }
});

// Fetch All rooms in the database
router.get('/rooms', authCheck, async (req, res) => {
  try {
    const user = req.user.username
    const rooms = await Chat.find({roomCreator: user})
    console.log(rooms)
    res.status(200).json(rooms)
  } catch(error) {
    res.status(400).json({error: error})
  }
})

module.exports = router;
