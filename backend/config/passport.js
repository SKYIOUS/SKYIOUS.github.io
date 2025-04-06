const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      
      if (!user) {
        return done(null, false);
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

// GitHub strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in our database
        let user = await User.findOne({ 'github.id': profile.id });
        
        if (user) {
          return done(null, user);
        }
        
        // If not, create a new user
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        
        // Check if there's an existing user with the same email
        user = await User.findOne({ email });
        
        if (user) {
          // Update existing user with GitHub details
          user.github = {
            id: profile.id,
            username: profile.username
          };
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          username: profile.username || `github_${profile.id}`,
          email,
          password: Math.random().toString(36).slice(2, 10), // Random password
          github: {
            id: profile.id,
            username: profile.username
          },
          profileImage: profile.photos[0] ? profile.photos[0].value : 'default-avatar.jpg',
          status: 'pending' // New users need admin approval
        });
        
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in our database
        let user = await User.findOne({ 'google.id': profile.id });
        
        if (user) {
          return done(null, user);
        }
        
        // If not, create a new user
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        
        // Check if there's an existing user with the same email
        user = await User.findOne({ email });
        
        if (user) {
          // Update existing user with Google details
          user.google = {
            id: profile.id,
            email
          };
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          username: `user_${Date.now().toString().slice(-4)}`,
          email,
          password: Math.random().toString(36).slice(2, 10), // Random password
          google: {
            id: profile.id,
            email
          },
          profileImage: profile.photos[0] ? profile.photos[0].value : 'default-avatar.jpg',
          status: 'pending' // New users need admin approval
        });
        
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}); 