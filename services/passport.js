const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Creating local strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, async (email, password, done)=>{
  // Verify this email and password
  // if yes call done with user
  // if no call done with false

  try{
    const user = await User.findOne({email: email.toLowerCase()});
    if(!user){
      return done(null, false);
    }

    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err);}
      if(!isMatch){ return done(null, false);}

      return done(null, user);
    })

  }
  catch(err){
    done(err);
  }
})


// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy( jwtOptions, async function(payload, done){
  // See if the user_id exists in database
  // if yes, return done with user_id
  // else return done without user_id

  try{
    const user = await User.findById(payload.sub);

    if(user){
      done(null, user);
    }
    else{
      done(null, false);
    }
  }
  catch(err){
    done(err, false);
  }
});


// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
