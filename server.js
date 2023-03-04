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
const helmet = require("helmet");
const socketHandler = require("./socket");
const colors = require("colors")

/* set view engine */
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(helmet());

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

socketHandler(httpServer);

mongoose.connect(process.env.MONGO_URI, () => {
  httpServer.listen(PORT, () => {
    console.log("+++++++++++++++++++++++++++++".red)
    console.log("[OK] SERVER IS STARTED AT: ".yellow)
    console.log(`[OK] http://localhost:${PORT}`.green);
    console.log("[OK] VISIT THE ADDRESS ABOVE".yellow)
    console.log("=============================".blue)
  });
});
