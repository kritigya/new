const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// User serialization
passport.serializeUser((user, done) => {
    done(null, user);
});

// User deserialization
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
},
(accessToken, refreshToken, profile, done) => {
    // User lookup or creation logic here
    return done(null, profile);
}));
