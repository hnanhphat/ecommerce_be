const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const User = require("../models/User");

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(err, user); // Will pass User infomation to req
});

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      fbGraphVersion: "v3.0",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {
          facebookId: profile.id,
          fullname: profile.displayName,
          username: profile.emails[0].value.slice(
            0,
            profile.emails[0].value.indexOf("@")
          ),
          email: profile.emails[0].value,
          emailVerified: true,
          avatarUrl: profile.photos[0].value,
        },
        function (error, user) {
          return done(error, user);
        }
      );
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },

    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {
          googleId: profile.id,
          fullname: profile.displayName,
          username: profile.emails[0].value.slice(
            0,
            profile.emails[0].value.indexOf("@")
          ),
          email: profile.emails[0].value,
          emailVerified: true,
          avatar: profile._json.picture,
        },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);
