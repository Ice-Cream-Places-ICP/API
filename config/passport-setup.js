const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const User = require('../models/User');
const { authMethod, userStatus } = require('./constants');

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.use(
    new GoogleStrategy({
        callbackURL: `${process.env.API_URL}/auth/google/redirect`,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
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
                status
            });

            user = await user.save();
        }
        else {
            if (user.authType !== authMethod.GOOGLE) {
                const err = new Error('This account can only be logged into with Google');
                return done(err);
            }
        }

        done(null, user);
    })
)

passport.use(
    new FacebookStrategy({
        callbackURL: `${process.env.API_URL}/auth/facebook/redirect`,
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        profileFields: ['id', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        let user = await User.findOne({ facebookId: profile.id }).exec();
        
        if (!user) {
            if (!profile._json?.email) {
                const err = new Error('Sign up with Facebook requires email address to be set');
                return done(err);
            }

            const email = profile._json.email;
            const facebookId = profile.id;
            const authType = authMethod.FACEBOOK;
            const status = userStatus.ACTIVE;

            user = new User({
                email,
                facebookId,
                authType,
                status
            });

            user = await user.save();
        }
        else {
            if (user.authType !== authMethod.FACEBOOK) {
                const err = new Error('This account can only be logged into with Facebook');
                return done(err);
            }
        }

        done(null, user);
    })
)