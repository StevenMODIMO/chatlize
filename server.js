require("dotenv").config();
const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const profileRoute = require("./routes/profile-route");
const passportConfiguration = require("./config/passport-setup");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const app = express();

/* set view engine */
app.set("view engine", "ejs");

app.use(express.static("public"));

/* Initialize session configs here */
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

/* Initialize passport to use session */
app.use(passport.initialize());
app.use(passport.session());

/* Setup middlewares */
app.use("/", authRoutes);
app.use("/profile", profileRoute);

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

/* View home page */
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

mongoose.connect(process.env.MONGO_URI, () => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
