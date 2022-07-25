const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const UserStockList = require('../models/portfolio');

passport.use(
    new GoogleStrategy(
      // Configuartion object
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
      },
      // The verify callback function
      // Marking a function as an async function
      // allows us to consume promises using await
      async function(accessToken, refreshToken, profile, cb) {
        // A user has logged in with OAuth...
        // Instead of using promise.then with a callback,
        // we can use the await keyword followed by the promise.
        // When that promise is fulfilled, it will return
        // whatever the promise's resolved value is.
        let user = await User.findOne({ googleId: profile.id });
        // Existing user found, so provide it to passport
        if (user) return cb(null, user);
        // We have a new user via OAuth!
        // When using async/await to consume promises,
        // there is no use of .then or .catch, so we
        // use a try/catch block to handle an error
        try {
          user = await User.create({
            name: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value
          });
          let tempUserId = user._id
          let tempUserName = user.name
          let tempUserAvatar = user.avatar
          userTwo = await UserStockList.create({
            user: tempUserId,
            userName: tempUserName,
            userAvatar: tempUserAvatar
          })
          return cb(null, user, userTwo);
        } catch (err) {
          // An error occured
          return cb(err);
        }
      }
    )
  );
  
  passport.serializeUser(function(user, cb) {
    // Return a nugget of info that passport
    // will give us each time a request is made by
    // this logged in user
    cb(null, user._id);
  });
  
  // Called with every request by a logged in user
  passport.deserializeUser(async function(userId, cb) {
    // Return the user's doc so that passport
    // can assign it to req.user
    const user = await User.findById(userId);
    cb(null, user);
  });