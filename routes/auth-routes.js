const router = require("express").Router();
const passport = require("passport");

/* Render login page */
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res, done) => {
  req.logout()
  res.redirect('/')
});

/* Authenticate using google */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

/* Redirect uri */
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
