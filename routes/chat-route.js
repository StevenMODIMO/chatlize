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

// Create a New Room
router.post("/new-room", authCheck);

// Join an existing room
router.post("/join-room", authCheck);

// Get rooms created by user
router.get("/user-rooms", authCheck)

// Get all rooms joined by user
router.get("/joined-rooms", authCheck)

// Delete room created by user
router.delete("/:id", authCheck)

// Leave room joined by user

module.exports = router;