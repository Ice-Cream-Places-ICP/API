const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");
const { authMethod, userStatus } = require("./constants");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //         callbackURL: '/auth/google/redirect',
      callbackURL: "https://ice-cream-places-web.vercel.app/google/success",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id }).exec();

      if (!user) {
        const email = profile._json.email;
        const googleId = profile.id;
        const authType = authMethod.GOOGLE;
        const status = userStatus.ACTIVE;

        user = new User({
          email,
          googleId,
          authType,
          status,
        });

        user = await user.save();
      } else {
        if (user.authType !== authMethod.GOOGLE) {
          const err = new Error(
            "This account can only be logged into with Google"
          );
          return done(err);
        }
      }

      done(null, user);
    }
  )
);
