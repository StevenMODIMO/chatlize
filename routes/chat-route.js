const router = require("express").Router();
const { 
  createNewRoom,
  joinRoom,
  userRooms,
  joinedRooms,
  deleteRoom,
  leaveRoom
} = require('../controllers/chat-controllers')

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

// Create a New Room
router.post("/new-room", authCheck, createNewRoom);

// Join an existing room
router.post("/join-room", authCheck, joinRoom);

// Get rooms created by user
router.get("/user-rooms", authCheck, userRooms)

// Get all rooms joined by user
router.get("/joined-rooms", authCheck, joinedRooms)

// Delete room created by user
router.delete("/delete/:id", authCheck, deleteRoom)

// Leave room joined by user
router.delete('/leave/:id', leaveRoom)

module.exports = router; 