require("dotenv").config();
const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const chatRoute = require("./routes/chat-route");
const passportConfiguration = require("./config/passport-setup");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const cors = require("cors");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("msg", (msg) => {
    console.log("message", msg);
    io.emit("message", msg)
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

/* set view engine */
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

/* Initialize session configs here */
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 5000,
    keys: [process.env.COOKIE_KEY],
  })
);

/* Initialize passport to use session */
app.use(passport.initialize());
app.use(passport.session());

/* Setup middlewares */
app.use("/", authRoutes);
app.use("/chat", chatRoute);

/* View home page */
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

mongoose.connect(process.env.MONGO_URI, () => {
  httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
