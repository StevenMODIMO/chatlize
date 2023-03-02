require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FaceBookStrategy = require("passport-facebook");
const GithubStrategy2 = require("passport-github2");
const User = require("../model/user-model");

// Serialize user here
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

/* START OF GOOGLE STRATEGY */
passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/google/redirect",
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        // if user exists
        if (existingUser) {
          done(null, existingUser);
        } else {
          // if user doesn't exist
          new User({
            username: profile.displayName,
            googleID: profile.id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
/* END OF GOOGLE STRATEGY */


/* START OF FACEBOOK STRATEGY */
passport.use(
  new FaceBookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "/facebook/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        // if user exists
        if (existingUser) {
          done(null, existingUser);
        } else {
          // if user doesn't exist
          new User({
            username: profile.displayName,
            googleID: profile.id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
/* END OF FACEBOOK STRATEGY */

/* START OF GITHUB  STRATEGY */
passport.use(
  new GithubStrategy2(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "https://chat-fn4d.onrender.com/github/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ githubID: profile.id }).then((existingUser) => {
        // if user exists
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({
            username: profile.username,
            githubID: profile.id,
            thumbnail: profile._json.avatar_url,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
/* END OF GITHUB STRATEGY */
