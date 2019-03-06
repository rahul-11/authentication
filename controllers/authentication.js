const User = require('../models/user');
const jwt = require('jwt-simple');

// You must provide a config file before running the server, after cloning from github
const config = require('../config');

function tokenForUser (user){
  const timeStamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}


exports.signUp = async (req, res, next)=>{
  const {email, password} = req.body;

  if(!email || !password){
    res.status(422).send({error: "You must provide email and password"});
  }
  
  try{
    const user = await User.findOne({email: email});

    if(user){
      res.status(422).send({error: 'Email already in use'});
    }

    const newUser = new User({
      email: email,
      password: password
    });

    try{
      await newUser.save();
      res.send({ token: tokenForUser(newUser) });
    }
    catch(err){
      return next(err);
    }

  }
  catch(err){
    return next(err);
  }

};

exports.signIn = async(req, res, next)=>{
  // User has already verified thier email and password
  // All we need to do is to supply token to them
  // We are supplied User from passport file while calling done(null, user)
  res.send({ token: tokenForUser(req.user)});
}